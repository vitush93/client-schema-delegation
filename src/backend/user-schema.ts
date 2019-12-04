import gql from 'graphql-tag'
import { makeExecutableSchema } from 'graphql-tools';

const userSchema = gql`
    type User {
        id: String!
        username: String!
    }

    type Query {
        findUser(id: String!): User!
    }
`;

export default makeExecutableSchema({
    typeDefs: [userSchema],
    resolvers: {
        Query: {
            findUser: (_, arg) => ({ id: arg.id || 'user-unknown', username: 'john_doe' }),
        },
    },
});