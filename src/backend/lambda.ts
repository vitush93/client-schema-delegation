import { graphql, GraphQLSchema } from 'graphql';
import todoSchema from './todo-schema';
import userSchema from './user-schema';

const formatIntegrationError = (err: Error) => ({
    data: null,
    errors: [
        {
            message: err.message,
            stack: err.stack,
        },
    ],
});

const hasErrors = (result) => result.errors && result.errors.length > 0;

const formatErrors = (result) => {
    if (!hasErrors(result)) {
        return [];
    }

    return result.errors.map((err) => ({ message: err.message, stack: err.stack }));
};

const createLambdaGraphqlHandler = (schema: GraphQLSchema) => async (event, context, callback) => {
    const { query, variables } = event;

    try {
        const result = await graphql(schema, query, undefined, context, variables)

        result.errors = formatErrors(result);

        callback(null, result);

    } catch (err) {
        callback(null, formatIntegrationError(err));
    }
}

// user micro-service lambda adapter
export const userHandler = createLambdaGraphqlHandler(userSchema);

// todo micro-service lambda adapter
export const todoHandler = createLambdaGraphqlHandler(todoSchema);