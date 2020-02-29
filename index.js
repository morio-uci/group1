import graphqlHTTP from "express-graphql"
import resolvers from "./graphql/resolvers"
import schema from "./graphql/schema"
import express from 'express';

const app = express();
const staticRoute = express.static('public')

const PORT = process.env.PORT || 8080
const env = process.env.NODE_ENV || 'development'

app.use('api/graphql', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: env === 'development'
}))
app.use( staticRoute );
app.use('/static', staticRoute );
app.listen(PORT, 'localhost');

export default app;


