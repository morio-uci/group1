import knex from "../../database"

export const seed = async knex => {
  // Deletes ALL existing entries
    await knex.raw('TRUNCATE TABLE tag_lines CASCADE')
    await knex('tags').del()

    await knex('tags').insert([
        {tag: 'beautiful'},
        {tag: 'scenic'},
        {tag: 'scenery'},
        {tag: 'monochrome'}
    ])

    await knex('tag_lines').insert([
        {id: 1, pic_id: 'pic2', tag: 'scenic'},
        {id: 2, pic_id: 'pic1', tag: 'beautiful'},
        {id: 3, pic_id: 'pic2', tag: 'beautiful'}
    ])
}
