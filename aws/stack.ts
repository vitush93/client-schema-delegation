import { App, Stack, Duration, CfnOutput } from '@aws-cdk/core';
import { Function, Runtime, Code } from '@aws-cdk/aws-lambda';

const app = new App();
const stack = new Stack(app, 'DelegationTest');

const code = Code.asset('dist');

const todoHandler = new Function(stack, 'TodoHandler', {
    code,
    functionName: 'TodoHandler',
    runtime: Runtime.NODEJS_12_X,
    handler: 'src/backend/lambda.todoHandler',
    memorySize: 1536,
    timeout: Duration.seconds(10),
});

const userHandler = new Function(stack, 'UserHandler', {
    code,
    functionName: 'UserHandler',
    runtime: Runtime.NODEJS_12_X,
    handler: 'src/backend/lambda.userHandler',
    memorySize: 1536,
    timeout: Duration.seconds(10),
});