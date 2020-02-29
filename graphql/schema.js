import { buildSchema } from "graphql"

export default buildSchema(`
type Query {
    getTags(id: ID!): String
}
type Mutation {
    updateTags(id: ID!): String
}
`)
