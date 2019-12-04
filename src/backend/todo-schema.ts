import gql from 'graphql-tag'
import { makeExecutableSchema } from 'graphql-tools'

const todoSchema = gql`
    type Todo {
        id: String!
        createdBy: String!
        text: String!
        completed: Boolean!
    }

    type Query {
        findTodos: [Todo]!
    }
`;

export default makeExecutableSchema({
    typeDefs: [todoSchema],
    resolvers: {
        Query: {
            findTodos: () => [{
                id: 'todo-1',
                createdBy: 'user-1',
                text: 'something to do',
                completed: false,
            }],
        },
    },
});