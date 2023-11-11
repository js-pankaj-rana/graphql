import { createServer } from 'node:http'
import { createSchema, createYoga  } from 'graphql-yoga'

// Type definitions (schema)
const yoga = createYoga({
    schema: createSchema({
        typeDefs: `
        type Query {
            hello: String!
            name: String!
            location: String!
            bio: String!
        }`,
        resolvers: {
            Query: {
                hello() {
                    return 'This is my first query!'
                },
                name() {
                    return 'Andrew Mead'
                },
                location() {
                    return 'Philadelphia'
                },
                bio() {
                    return 'I live in Philly and teach on Udemy!'
                }
            }
        }
    })
})

    
const server = createServer(yoga)

server.listen(1001, () => {
    console.info('Server is running on http://localhost:1001/graphql')
  })
