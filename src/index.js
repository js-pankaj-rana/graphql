import { createServer } from 'node:http'
import { createSchema, createYoga  } from 'graphql-yoga'
import { title } from 'node:process'

const users = [
    {
        id: '1',
        name: 'Ram',
        email: 'ram@gmail.com'
    },
    {
        id: '2',
        name: 'Anuj',
        email: 'anuj@gmail.com'
    }
]

const posts = [
    {
        id: '2123',
        title: 'Post Title 1',
        body: 'Some body content of the post 1',
        published: 2009
    },
    {
        id: '2012',
        title: 'Post Title 2',
        body: 'Some body content of the post 2',
        published: 2019
    },
    {
        id: '2125',
        title: 'Post Title 3',
        body: 'Some body content of the post 3',
        published: 2020
    },{
        id: '2103',
        title: 'Post Title 4',
        body: 'Some body content of the post 4',
        published: 2021
    }
]

// Type definitions (schema)
const yoga = createYoga({
    schema: createSchema({
        typeDefs: `
        
        type Query {
            users: [User!]!
            posts(query: String): [Post!]! 
            greeting(name: String, age: Int): String
            add(a:Float!, b:Float!): Float! 
            me: User!
        },
        type User {
            id: ID!
            name: String!
            email: String!
            age: Int
        },

        type Post {
            id: ID!
            title: String!
            body: String!
            published: Int!
        }

        `,
        resolvers: {
            Query: {
                users(){
                    return users;
                }, 
                posts(parents, args, ctx, info){
                    if(!args.query){
                        return posts;
                    }
                    return posts.filter( post => {
                        if(post.title.toLowerCase().includes(args.query.toLowerCase()) 
                          || post.body.toLowerCase().includes(args.query.toLowerCase())) {
                            return true
                          }
                        else{
                            return false
                        }
                    })
                },
                greeting(parents, args, ctx, info){
                    if(!args.name && !args.age){
                        return 'Hello there!'
                    }
                    else {
                        return `Hello ${args.name} and you are ${args.age} years old`
                    }
                },
                add(parents, args, ctx, info){
                    return args.a + args.b
                },
                me() {
                    return {
                        id: 'abc123',
                        name: 'Suman Kumar',
                        email: 'abc@gmail.com',
                        age: 12
                    }
                }
            }
        }
    })
})

    
const server = createServer(yoga, {
    landingPage: false
})

server.listen(1001, () => {
    console.info('Server is running on http://localhost:1001/graphql')
  })
