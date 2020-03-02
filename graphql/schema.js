import { buildSchema } from "graphql"

export default buildSchema(`
input Search {
    query: String!
}
input Update {
    id: ID!
    tags: String!
}
type TagLine {
    id: ID!
    tags: String!
}
type SearchResults {
    results: [String]!
}
                
type Query {
    getTags(id: ID!): TagLine!
    search(query: Search!): SearchResults!
}
type Mutation {
    updateTags(update: Update!): TagLine!
}
`)
