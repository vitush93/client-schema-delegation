import { ApolloLink, Observable } from 'apollo-link';
import AWS from 'aws-sdk';
import { print } from 'graphql/language/printer';

export class LambdaLink extends ApolloLink {}

export const createLambdaTransport = (lambda: AWS.Lambda, functionArn: string): LambdaLink => {
    return new ApolloLink((operation) => {
        const { variables } = operation;

        const context = operation.getContext() && operation.getContext().graphqlContext;

        const query = print(operation.query);
        const params = {
            FunctionName: functionArn,
            Payload: JSON.stringify({ query, variables, context }),
        };

        return new Observable((observer) => {
            lambda
                .invoke(params)
                .promise()
                .then(({ StatusCode, Payload, FunctionError, LogResult }) => {
                    if (StatusCode !== 200) {
                        throw new Error(`${functionArn}: ${FunctionError} ${LogResult}`);
                    }

                    const payload = JSON.parse(Payload as any);
                    if (!!payload.errorMessage) {
                        throw new Error(payload.errorMessage);
                    } else {
                        observer.next(payload);
                    }

                    observer.complete();
                })
                .catch((err) => {
                    console.log(`${functionArn} invoke error: ${err.message || ''}`);
                    console.log(err);

                    observer.error(err);
                });
        });
    });
};
