/* tslint:disable */

import AWS from 'aws-sdk';
import fs from 'fs';

const lambda = new AWS.Lambda({ region: 'eu-west-1' });

const deployFunction = (FunctionName: string, ZipFile: Buffer) => lambda.updateFunctionCode({ ZipFile, FunctionName })
    .promise()
    .then(console.log)
    .catch(console.trace);

const deployFunctions = async (functionNames: string[]) => {
    console.log('loading zip package..');
    const ZipFile = fs.readFileSync('package.zip');
    console.log('finished loading zip package');

    console.log('uploading code..');
    await Promise.all(
        functionNames
            .filter(Boolean)
            .map(name => deployFunction(name, ZipFile))
    );
};

deployFunctions([
    'TodoHandler',
    'UserHandler',
])
    .catch(console.trace);