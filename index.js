import graphqlHTTP from "express-graphql"
import resolvers from "./graphql/resolvers"
import schema from "./graphql/schema"
import express from 'express';

const app = express();
const staticRoute = express.static('public')
const env = process.env.NODE_ENV || 'development'
const PORT = process.env.PORT || 8080
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : (process.env.HOST || 'localhost')

app.use('/api/graphql', graphqlHTTP({
    schema,
    rootValue: resolvers,
    graphiql: env === 'development'
}))

app.use( staticRoute )
app.use('/static', staticRoute )
app.listen(PORT, HOST, () => {console.log(`Server running on http://${HOST}:${PORT}`)})


export default app;


