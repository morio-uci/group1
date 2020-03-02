import { buildSchema } from "graphql"

export default buildSchema(`
input Search {
    query: String!
}
input Update {
    id: ID!
    tags: String!
}

input Paging {
    limit: Int
    offset: Int
}

type TagLine {
    id: ID!
    tags: String!
}
type SearchResults {
    results: [String]!
}

type TagWithCount {
    tag: String!
    count: Int!
}

type PopularTags {
    total: Int!
    tags: [TagWithCount]!
}

type UnusedTags {
    total: Int!
    tags: [String]!
}

type Query {
    getTags(id: ID!): TagLine!
    search(query: Search!): SearchResults!
    popularTags(paging: Paging): PopularTags!
    unusedTags(paging: Paging): UnusedTags!
}

type Mutation {
    updateTags(update: Update!): TagLine!
}
`)
