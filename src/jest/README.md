# Jest Setup

The simplest setup is to use jest's `setupFilesAfterEnv` config.

Make sure your `package.json` includes the following:

```json
// package.json
"jest": {
  "setupFilesAfterEnv": ["./node_modules/aws-testing-library/lib/jest/index.js"],
},
```

## Usage with TypeScript

When using `aws-testing-library` with [TypeScript](http://typescriptlang.org/) and [ts-jest](https://github.com/kulshekhar/ts-jest), you'll need to add a `setupFrameworks.ts` file to your app that explicitly imports `aws-testing-library`, and point the `setupFilesAfterEnv` field in your `package.json` file towards it:

```typescript
// src/setupFrameworks.ts
import 'aws-testing-library/lib/jest';
```

```json
// package.json
"jest": {
 "setupFilesAfterEnv": ["./src/setupFrameworks.ts"],
},
```

## Assertions

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

### `toHaveItem()`

Asserts existence/equality of a DynamoDb item

```js
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

### `toHaveObject()`

Asserts existence/equality of a S3 object

```js
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

### `toHaveLog()`

Asserts log message of a lambda function

```js
await expect({
  region: 'us-east-1',
  function: 'functionName',
  startTime: 0 /* optional (millis since epoch in UTC, defaults to now-1 hour) */,
  timeout: 0 /* optional (defaults to 2500) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).toHaveLog(
  'some message written to log by the lambda' /* a pattern to match against log messages */,
);
```

[See complete example](https://github.com/erezrokah/hello-retail/blob/master/e2eTests/src/sendUserLogin.test.ts)

### `toBeAtState()`

Asserts a state machine current state

```js
await expect({
  pollEvery: 5000 /* optional (defaults to 500) */,
  region: 'us-east-1',
  stateMachineArn: 'stateMachineArn',
  timeout: 30 * 1000 /* optional (defaults to 2500) */,
}).toBeAtState('ExpectedState');
```

[See complete example](https://github.com/erezrokah/hello-retail/blob/master/e2eTests/src/newProduct.test.ts#L73)

### `toHaveState()`

Asserts that a state machine has been at a state

```js
await expect({
  pollEvery: 5000 /* optional (defaults to 500) */,
  region: 'us-east-1',
  stateMachineArn: 'stateMachineArn',
  timeout: 30 * 1000 /* optional (defaults to 2500) */,
}).toHaveState('ExpectedState');
```

[See complete example](https://github.com/erezrokah/hello-retail/blob/master/e2eTests/src/stateMachine.test.ts#L97)

### `toReturnResponse()`

Asserts that an api returns a specific response

```js
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

### `toHaveRecord()`

Asserts existence/equality of a Kinesis record

```js
await expect({
  region: 'us-east-1',
  stream: 'kinesis-stream',
  timeout: 0 /* optional (defaults to 10000) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).toHaveRecord(
  (item) => item.id === 'someId' /* predicate to match with the stream data */,
);
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/kinesis-service/e2e/handler.test.ts)

### `toHaveMessage()`

Asserts existence/equality of a message in an SQS queue

```js
const {
  subscribeToTopic,
  unsubscribeFromTopic,
} = require('aws-testing-library/lib/utils/sqs');

let [subscriptionArn, queueUrl] = ['', ''];
try {
  // create an SQS queue and subscribe to SNS topic
  ({ subscriptionArn, queueUrl } = await subscribeToTopic(region, topicArn));

  // run some code that will publish a message to the SNS topic
  someCodeThatResultsInPublishingAMessage();

  await expect({
    region,
    queueUrl,
    timeout: 10000 /* optional (defaults to 2500) */,
    pollEvery: 2500 /* optional (defaults to 500) */,
  }).toHaveMessage(
    /* predicate to match with the messages in the queue */
    (message) =>
      message.Subject === 'Some Subject' && message.Message === 'Some Message',
  );
} finally {
  // unsubscribe from SNS topic and delete SQS queue
  await unsubscribeFromTopic(region, subscriptionArn, queueUrl);
}
```

[See complete example](https://github.com/erezrokah/serverless-monitoring-app/blob/master/services/monitoring-tester-service/e2e/checkEndpointStepFunction.test.ts)
