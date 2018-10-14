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
  key: { id: 'itemId' } /* dynamodb key object (https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB.html#getItem-property) */,
  item: { id: 'itemId', createdAt: someTimestamp, text: 'some content' }, /* optional, if exists will check equality in addition to existence */,
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
  key: 'someFileInTheBucket', /* a string representing the object key in the bucket */,
  expectedBuffer: Buffer.from('a buffer of the file content'), /* optional, if exists will check equality in addition to existence */,
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
  pattern: 'some message written to log by the lambda', /* a pattern to match against log messages */,
);
```

[See complete example](https://github.com/erezrokah/hello-retail/blob/master/e2eTests/src/sendUserLogin.test.ts)

### Utils

- [invoke()](#invoke)
- [clearAllItems()](#clearallitems)
- [clearAllObjects()](#clearallobjects)
- [deleteAllLogs()](#deletealllogs)
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

await clearAllObjects('us-east-1', 's3-bucket');
```

#### `deleteAllLogs()`

Clear all log streams for a lambda function

```typescript
const { deleteAllLogs } = require('jest-e2e-serverless/lib/utils/cloudwatch');

await deleteAllLogs('us-east-1', 'lambda-function-name');
```

#### `deploy()`

Deploys the current service using [Serverless framework](https://serverless.com/)

```typescript
const { deploy } = require('jest-e2e-serverless/lib/utils/serverless');

await deploy('dev' /* optional - deployment stage */);
```
