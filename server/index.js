const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { QueryDocumentKeys } = require('graphql/language/ast');
const axios = require('axios');

async function startServer() {
    const app = express();
    const server = new ApolloServer({
        typeDefs: `

        type User {
            id: ID!
            name: String!
            username: String!
            email: String!
            phone: String!
            website: String!
        }

        type Todo {
            id: ID!
            title: String!
            completed: Boolean
            userId: String!
            user: User
        }

        type Query {
            getTodos: [Todo]
            getUser(id: ID!): User
            getAllUsers: [User]
        }

        `,
        resolvers: {
            Todo: {
                user: async (todo) => {
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.userId}`);
                    return response.data;
                }
            },
            Query: {
                getTodos: async () => {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
                    return response.data;
                },

                getUser: async (parent, { id }) => {
                    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);
                    return response.data;
                },

                getAllUsers: async () => {
                    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
                    return response.data;
                }
            }
        },
    });
    app.use(cors());
    app.use(bodyParser.json());
    await server.start();
    app.use('/graphql', expressMiddleware(server));
    
    app.listen(8000, () => {
        console.log('Server is running on port 8000');
    });
}

startServer();