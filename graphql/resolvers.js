import {getTags, searchTags, updateTags} from '../services/tags'

const resolvers =  {
    getTags: async ({id}) => {
        return await getTags(id)
    },
    search: async ({query}) => {
        return await searchTags(query)
    },
    updateTags: async ({update}) => {
        return await updateTags(update)
    }
}
export default resolvers