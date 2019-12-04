# ApolloClient Serverless schema stitching demo

Demo of merging remote GraphQl schemas located in separate AWS Lambda functions.

This enables granular schema control and accesing individual microservice directly without proxying / delegating / apollo-gateway.

* install deps with `yarn install`
* build sources `yarn build`
* install deps for built package `yarn build:install`
* deploy to AWS `yarn deploy`
  * make sure your AWS credentials / region are set
* test running gql query with `yarn test`
  * make sure your AWS credentials / region are set