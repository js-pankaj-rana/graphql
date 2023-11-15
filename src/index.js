import { createServer } from 'node:http'
import { createSchema, createYoga  } from 'graphql-yoga'
import { v4 as uuidv4 } from 'uuid';


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
    },
    {
        id: '3',
        name: 'Rahul Maheshwari',
        email: 'rahulmaheshwari@gmail.com'
    }
]

const comments = [
    {
        id: '201',
        text: 'This is my text example',
        author: '1'
    },
    {
        id: '202',
        text: 'This is my text example',
        author: '2'
    },
    {
        id: '203',
        text: 'This is my text example',
        author: '1'
    },
    {
        id: '204',
        text: 'This is my text example',
        author: '3'
    },
    {
        id: '205',
        text: 'This is my text example',
        author: '2'
    },
    {
        id: '206',
        text: 'This is my text example',
        author: '3'
    },
    {
        id: '207',
        text: 'This is my text example',
        author: '3'
    }
]
const posts = [
    {
        id: '2123',
        title: 'Post Title 1',
        body: 'Some body content of the post 1',
        published: true,
        author: '1'
    },
    {
        id: '2012',
        title: 'Post Title 2',
        body: 'Some body content of the post 2',
        published: true,
        author: '2'
    },
    {
        id: '2125',
        title: 'Post Title 3',
        body: 'Some body content of the post 3',
        published: true,
        author: '1'
    },{
        id: '2103',
        title: 'Post Title 4',
        body: 'Some body content of the post 4',
        published: true,
        author: '2'
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
            comments: [Comment!]!
        },

        type Mutation {
            createUser(name: String!, email: String!, age: Int): User!
            createPost(title: String!, body: String!, published: Boolean!, author: ID!): Post!
        },

        type User {
            id: ID!
            name: String!
            email: String!
            age: Int
            comments: [Comment!]!
        },

        type Post {
            id: ID!
            title: String!
            body: String!
            published: Boolean!
            author: User!
        }

        type Comment {
            id: ID!
            text: String!
            author: User!
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
                },
                comments(){
                    return comments;
                }
            },
            Mutation: {
                createUser(parents, args, ctx, info){
                    const userExits = users.some( user => user.email === args.email);
                    if(userExits){
                        throw new Error("User already exits")
                    }
                    const user = {
                        id: uuidv4(),
                        name: args.name,
                        email: args.email,
                        age: args.age
                    }
                    users.push(
                        user
                    )
                    return user;
                },

                createPost(parents, args, ctx, info) {
                    const userExit = users.some( user => user.id === args.author);
                    if(!userExit){
                        throw new Error("User is not available")
                    }
                    const post = {
                        id: uuidv4(),
                        title: args.title,
                        body: args.body,
                        published: args.published,
                        author: args.author
                    }

                    posts.push(post);

                    return post;
                }
            },
            Post: {
                author(parents, args, ctx, info){
                    return users.find((user) => {
                        return user.id ===parents.author
                    })
                } 
            },
            Comment: {
                author(parents, args, ctx, info){
                    // console.log("parents", parents);
                    return users.find((user) => {
                        return user.id === parents.author
                    })
                } 
            },
            User: {
                comments(parents, args, ctx, info){
                    return comments.filter( (comment) => {
                        return comment.author  === parents.id
                    })
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
