import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import SchemaLink from 'apollo-link-schema';
import AWS from 'aws-sdk';
import { introspectSchema, mergeSchemas, makeRemoteExecutableSchema } from 'graphql-tools';
import { createLambdaTransport } from './lambda-link';
import gql from 'graphql-tag';

const lambda = new AWS.Lambda();

const createClient = async () => {
    const todoLink = createLambdaTransport(lambda, 'TodoHandler');
    const todoSchemaDefinition = await introspectSchema(todoLink);

    const userLink = createLambdaTransport(lambda, 'UserHandler');
    const userSchemaDefinition = await introspectSchema(userLink);

    const todoSchema = makeRemoteExecutableSchema({ link: todoLink, schema: todoSchemaDefinition });
    const userSchema = makeRemoteExecutableSchema({ link: userLink, schema: userSchemaDefinition });

    const schema = mergeSchemas({
        schemas: [todoSchema, userSchema],
    });

    const cache = new InMemoryCache();
    const link = new SchemaLink({ schema });

    const client = new ApolloClient({
        cache,
        link,
    });

    return client;
};

createClient()
    .then(async client => {
        const { data, errors } = await client.query({
            query: gql`
                query {
                    findTodos {
                        id
                        text
                        completed
                    }
                    findUser(id:"user-1") {
                        id
                        username
                    }
                }
            `,
        });

        console.log('GraphQL Result:');
        console.log({ data, errors });
    })
    .catch(console.log);