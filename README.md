# jest-e2e-serverless

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/erezrokah/jest-e2e-serverless.svg?style=svg)](https://circleci.com/gh/erezrokah/jest-e2e-serverless)

> Note: This library is still at POC level, if you're missing any capability please open an issue :)

## Prerequisites

You should have your aws credentials under `~/.aws/credentials` (if you have [aws cli](https://aws.amazon.com/cli/) installed and configured).

> Note: aws credentials are loaded automatically as described [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)

If you plan to use the [deploy](#deploy) utility function please install and configure [serverless](https://serverless.com/framework/docs/getting-started/).

[node](https://nodejs.org/en/) >= 8 (for `async/await` support).

## Installation

Install with [yarn](https://github.com/yarnpkg/yarn)

```bash
yarn add jest-e2e-serverless --dev
```

or [npm](https://www.npmjs.com/)

```bash
npm install jest-e2e-serverless --save-dev
```

### Setup

The simplest setup is to use jest's `setupTestFrameworkScriptFile` config.

Make sure your `package.json` includes the following:

```json
// package.json
"jest": {
  "setupTestFrameworkScriptFile": "./node_modules/jest-e2e-serverless/lib/index.js",
},
```

#### Usage with TypeScript

When using `jest-e2e-serverless` with [TypeScript](http://typescriptlang.org/) and [ts-jest](https://github.com/kulshekhar/ts-jest), you'll need to add a `setupFrameworks.ts` file to your app that explicitly imports `jest-e2e-serverless`, and point the `setupTestFrameworkScriptFile` field in your `package.json` file towards it:

```typescript
// src/setupFrameworks.ts
import 'jest-e2e-serverless';
```

```json
// package.json
"jest": {
 "setupTestFrameworkScriptFile": "./src/setupFrameworks.ts",
},
```

### Assertions

> Notes
>
> - The matchers use `aws-sdk` under the hood, thus they are all asynchronous and require using `async/await`

- [toHaveItem()](#tohaveitem)
- [toHaveObject()](#tohaveobject)
- [toHaveLog()](#tohavelog)
- [toBeAtState()](#tobeatstate)
- [toHaveState()](#tohavestate)
- [toReturnResponse()](#toreturnresponse)
- [toHaveRecord()](#tohaverecord)
- [toHaveMessage()](#tohavemessage)

#### `toHaveItem()`

Asserts existence/equality of a DynamoDb item

```js
expect.assertions(1); // makes sure the assertion was called
await expect({
  region: 'us-east-1',
  table: 'dynamo-db-table',
  timeout: 0 /* optional (defaults to 2500) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).toHaveItem(
  {
    id: 'itemId',
  } /* dynamoDb key object (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property) */,
  {
    id: 'itemId',
    createdAt: new Date().getTime(),
    text: 'some content',
  } /* optional, if exists will check equality in addition to existence */,
  true /* optional, strict mode comparison, defaults to true */,
);
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/db-service/e2e/db.test.ts)

#### `toHaveObject()`

Asserts existence/equality of a S3 object

```js
expect.assertions(1); // makes sure the assertion was called
await expect({
  region: 'us-east-1',
  bucket: 's3-bucket',
  timeout: 0 /* optional (defaults to 2500) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).toHaveObject(
  'someFileInTheBucket' /* a string representing the object key in the bucket */,
  Buffer.from(
    'a buffer of the file content',
  ) /* optional, if exists will check equality in addition to existence */,
);
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/file-service/e2e/handler.test.ts)

#### `toHaveLog()`

Asserts log message of a lambda function

```js
expect.assertions(1); // makes sure the assertion was called
await expect({
  region: 'us-east-1',
  function: 'functionName',
  timeout: 0 /* optional (defaults to 2500) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).toHaveLog(
  'some message written to log by the lambda' /* a pattern to match against log messages */,
);
```

[See complete example](https://github.com/erezrokah/hello-retail/blob/master/e2eTests/src/sendUserLogin.test.ts)

#### `toBeAtState()`

Asserts a state machine current state

```js
expect.assertions(1); // makes sure the assertion was called
await expect({
  pollEvery: 5000 /* optional (defaults to 500) */,
  region: 'us-east-1',
  stateMachineArn: 'stateMachineArn',
  timeout: 30 * 1000 /* optional (defaults to 2500) */,
}).toBeAtState('ExpectedState');
```

[See complete example](https://github.com/erezrokah/hello-retail/blob/master/e2eTests/src/newProduct.test.ts#L73)

#### `toHaveState()`

Asserts that a state machine has been at a state

```js
expect.assertions(1); // makes sure the assertion was called
await expect({
  pollEvery: 5000 /* optional (defaults to 500) */,
  region: 'us-east-1',
  stateMachineArn: 'stateMachineArn',
  timeout: 30 * 1000 /* optional (defaults to 2500) */,
}).toHaveState('ExpectedState');
```

[See complete example](https://github.com/erezrokah/hello-retail/blob/master/e2eTests/src/stateMachine.test.ts#L97)

#### `toReturnResponse()`

Asserts that an api returns a specific response

```js
expect.assertions(1); // makes sure the assertion was called
await expect({
  url: 'https://api-id.execute-api.us-east-1.amazonaws.com/dev/api/private',
  method: 'POST',
  params: { urlParam: 'value' } /* optional URL parameters */,
  data: { bodyParam: 'value' } /* optional body parameters */,
  headers: { Authorization: 'Bearer token_value' } /* optional headers */,
}).toReturnResponse({
  data: {
    message: 'Unauthorized',
  },
  statusCode: 401,
});
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/api-service/e2e/privateEndpoint.test.ts#L8)

#### `toHaveRecord()`

Asserts existence/equality of a Kinesis record

```js
expect.assertions(1); // makes sure the assertion was called
await expect({
  region: 'us-east-1',
  stream: 'kinesis-stream',
  timeout: 0 /* optional (defaults to 10000) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).toHaveRecord(
  item => item.id === 'someId' /* predicate to match with the stream data */,
);
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/kinesis-service/e2e/handler.test.ts)

#### `toHaveMessage()`

Asserts existence/equality of a message in an SQS queue

```js
const {
  subscribeToTopic,
  unsubscribeFromTopic,
} = require('jest-e2e-serverless/lib/utils/sqs');

let [subscriptionArn, queueUrl] = ['', ''];
try {
  // create an SQS queue and subscribe to SNS topic
  ({ subscriptionArn, queueUrl } = await subscribeToTopic(region, topicArn));

  // run some code that will publish a message to the SNS topic
  someCodeThatResultsInPublishingAMessage();

  expect.assertions(1); // makes sure the assertion was called
  await expect({ region, queueUrl }).toHaveMessage(
    /* predicate to match with the messages in the queue */
    message =>
      message.Subject === 'Some Subject' && message.Message === 'Some Message',
  );
} finally {
  // unsubscribe from SNS topic and delete SQS queue
  await unsubscribeFromTopic(region, subscriptionArn, queueUrl);
}
```

[See complete example](https://github.com/erezrokah/serverless-monitoring-app/blob/master/services/monitoring-service/e2e/checkEndpointStepFunction.test.ts)

### Utils

- [invoke()](#invoke)
- [clearAllItems()](#clearallitems)
- [clearAllObjects()](#clearallobjects)
- [deleteAllLogs()](#deletealllogs)
- [stopRunningExecutions()](#stoprunningexecutions)
- [getResponse()](#getresponse)
- [deploy()](#deploy)

#### `invoke()`

Invokes a lambda function

```typescript
const { invoke } = require('jest-e2e-serverless/lib/utils/lambda');

const result = await invoke(
  'us-east-1',
  'functionName',
  {
    body: JSON.stringify({ text: 'from e2e test' }),
  } /* optional: payload for the lambda */,
);
```

#### `clearAllItems()`

Clear all items in a DynamoDb table

```typescript
const { clearAllItems } = require('jest-e2e-serverless/lib/utils/dynamoDb');

await clearAllItems('us-east-1', 'dynamo-db-table');
```

#### `clearAllObjects()`

Clear all objects in a s3 bucket

```typescript
const { clearAllObjects } = require('jest-e2e-serverless/lib/utils/s3');

await clearAllObjects(
  'us-east-1',
  's3-bucket',
  'key-prefix' /* optional, only delete objects with keys that begin with the specified prefix*/,
);
```

#### `deleteAllLogs()`

Clear all log streams for a lambda function

```typescript
const { deleteAllLogs } = require('jest-e2e-serverless/lib/utils/cloudwatch');

await deleteAllLogs('us-east-1', 'lambda-function-name');
```

#### `stopRunningExecutions()`

Stop all running executions for a state machine

```typescript
const {
  stopRunningExecutions,
} = require('jest-e2e-serverless/lib/utils/stepFunctions');

await stopRunningExecutions('us-east-1', 'state-machine-arn');
```

#### `getResponse()`

Send a request to an api and get a response

```typescript
const { getResponse } = require('jest-e2e-serverless/lib/utils/api');

const result = await getResponse(
  url: 'https://api-id.execute-api.us-east-1.amazonaws.com/dev/api/private',
  method: 'POST',
  params: { urlParam: 'value' } /* optional URL parameters */,
  data: { bodyParam: 'value' } /* optional body parameters */,
  headers: { Authorization: 'Bearer token_value' } /* optional headers */,
);
```

#### `deploy()`

Deploys the current service using [Serverless framework](https://serverless.com/)

```typescript
const { deploy } = require('jest-e2e-serverless/lib/utils/serverless');

await deploy('dev' /* optional - deployment stage */);
```
