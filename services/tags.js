/*
getTags: id should be a integer
searchTags: search should be an object that looks like { id: string, query: string }
updateTags: update should be an object that looks like { id: string, tags: string }
 */

export const getTags = async id => {
    return { id: id, tags: 'example string of tags' }
}

export const searchTags = async search => {
    return {
        id: search.id,
        results: [
            'partial search practice',
            'partial search pretext',
            'partial search pride',
            'partial search produce',
            'partial search prudence'
        ]
    }
}

export const updateTags = async update => {
    return { id: update.id, tags: 'updated string of tags' }
}
