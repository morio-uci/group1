import knex from '../database'
/*
getTags: id should be a string
searchTags: search should be an object that looks like { query: string }
updateTags: update should be an object that looks like { id: string, tags: string }
 */

export const getTags = async id => {
    if (typeof id !== 'string' || id.trim() === '') {
        return {id: '', tags: []}
    }
    const results = await knex('tag_lines')
        .where({pic_id: id})
        .orderBy('id')
        .select('tag')
    return { id: id, tags: results.map(result => result.tag).join(' ') }
}

export const searchTags = async search => {
    const popularQuery = knex('tag_lines')
        .groupBy('tag')
        .orderBy('count', 'desc').limit(10)

    if (!search.hasOwnProperty('query') || search.query === '') {
        const popularTags = await popularQuery.select(knex.raw("tag, count(tag)"))
        return {results: popularTags.map(row => row.tag)}
    }
    // last char is a space
    if (search.query.charAt(search.query.length-1) === ' ') {
        const excludeTags = search.query.trim().split(' ')
        let popularTags
        let preTagLine = search.query
        // split will include an empty string if string is empty
        if (excludeTags[0] === '') {
            popularTags = await popularQuery.select(knex.raw("tag, count(tag)"))
            preTagLine = ''
        }
        else {
            popularTags = await popularQuery
                .whereNotIn('tag', excludeTags)
                .select(knex.raw("tag, count(tag)"))
        }
        return {results: popularTags.map(row => preTagLine + row.tag)}
    }

    // last character isn't a space
    const excludeTags = search.query.trim().split(' ')
    const partialTag = excludeTags.pop()
    const partialQuery = knex('tags')
        .where('tag', 'like', knex.raw('?', [partialTag + '%']))
        .orderBy('tag')
        .limit(10)

    let partialMatches
    let preTagLine = ''
    if (excludeTags.length === 0) {
        partialMatches =  await partialQuery.select('tag')
    }
    else {
        partialMatches =  await partialQuery.whereNot('tag', excludeTags).select('tag')
        preTagLine = excludeTags.join(' ') + ' '
    }

    return {results: partialMatches.map(match => preTagLine + match.tag)}

}

export const updateTags = async update => {
    if (!update.hasOwnProperty('id') ||
        !update.hasOwnProperty('tags') ||
        update.id.trim() === '' ||
        update.tags.trim() === '') {

        return {id: update.hasOwnProperty('id') ? update.id : '', tags: '' }
    }

    await knex('tag_lines').where({'pic_id': update.id}).del()
    const tagsArray = update.tags.split(' ')
    let insertString = knex('tags')
        .insert(tagsArray.map(tag => ({tag: tag}))).toString()
    insertString += ' ON CONFLICT (tag) DO  NOTHING'
    await knex.raw(insertString)
    await knex('tag_lines')
        .insert(tagsArray.map(tag => ({pic_id: update.id, tag: tag})))
    return await getTags(update.id)
}
