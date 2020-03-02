import {getTags, searchTags, updateTags, getPopularTags, getUnusedTags} from '../services/tags'

const resolvers =  {
    getTags: async ({id}) =>  await getTags(id),
    search: async ({query}) => await searchTags(query),
    updateTags: async ({update}) => await updateTags(update),
    popularTags: async options => await getPopularTags(options.paging || {}),
    unusedTags: async options => await getUnusedTags(options.paging || {})
}
export default resolvers