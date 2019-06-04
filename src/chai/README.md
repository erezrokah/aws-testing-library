# Chai Setup

```js
const awsTesting = require('aws-testing-library/lib/chai');
const chai = require('chai');
chai.use(awsTesting);

const { expect } = chai;

// write assertions using expect
```

## Usage with TypeScript

```typescript
import awsTesting from 'aws-testing-library/lib/chai';
import chai = require('chai');

chai.use(awsTesting);

const { expect } = chai;

// write assertions using expect
```

## Assertions

> Notes
>
> - The matchers use `aws-sdk` under the hood, thus they are all asynchronous and require using `async/await`

- [to.have.item()](#tohaveitem)
- [to.have.object()](#tohaveobject)
- [to.have.log()](#tohavelog)
- [to.be.atState()](#tobeatstate)
- [to.have.state()](#tohavestate)
- [to.have.response()](#tohaveresponse)
- [to.have.record()](#tohaverecord)
- [to.have.message()](#tohavemessage)

### `to.have.item()`

Asserts existence/equality of a DynamoDb item

```js
await expect({
  region: 'us-east-1',
  table: 'dynamo-db-table',
  timeout: 0 /* optional (defaults to 2500) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).to.have.item(
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

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/db-service/e2e/db.chai.test.ts)

### `to.have.object()`

Asserts existence/equality of a S3 object

```js
await expect({
  region: 'us-east-1',
  bucket: 's3-bucket',
  timeout: 0 /* optional (defaults to 2500) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).to.have.object(
  'someFileInTheBucket' /* a string representing the object key in the bucket */,
  Buffer.from(
    'a buffer of the file content',
  ) /* optional, if exists will check equality in addition to existence */,
);
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/file-service/e2e/handler.chai.test.ts)

### `to.have.log()`

Asserts log message of a lambda function

```js
await expect({
  region: 'us-east-1',
  function: 'functionName',
  timeout: 0 /* optional (defaults to 2500) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).to.have.log(
  'some message written to log by the lambda' /* a pattern to match against log messages */,
);
```

### `to.be.atState()`

Asserts a state machine current state

```js
await expect({
  pollEvery: 5000 /* optional (defaults to 500) */,
  region: 'us-east-1',
  stateMachineArn: 'stateMachineArn',
  timeout: 30 * 1000 /* optional (defaults to 2500) */,
}).to.be.atState('ExpectedState');
```

### `to.have.state()`

Asserts that a state machine has been at a state

```js
await expect({
  pollEvery: 5000 /* optional (defaults to 500) */,
  region: 'us-east-1',
  stateMachineArn: 'stateMachineArn',
  timeout: 30 * 1000 /* optional (defaults to 2500) */,
}).to.have.state('ExpectedState');
```

### `to.have.response()`

Asserts that an api returns a specific response

```js
await expect({
  url: 'https://api-id.execute-api.us-east-1.amazonaws.com/dev/api/private',
  method: 'POST',
  params: { urlParam: 'value' } /* optional URL parameters */,
  data: { bodyParam: 'value' } /* optional body parameters */,
  headers: { Authorization: 'Bearer token_value' } /* optional headers */,
}).to.have.response({
  data: {
    message: 'Hello World!',
  },
  statusCode: 200,
});
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/api-service/e2e/publicEndpoint.chai.test.ts)

### `to.have.record()`

Asserts existence/equality of a Kinesis record

```js
await expect({
  region: 'us-east-1',
  stream: 'kinesis-stream',
  timeout: 0 /* optional (defaults to 10000) */,
  pollEvery: 0 /* optional (defaults to 500) */,
}).to.have.record(
  item => item.id === 'someId' /* predicate to match with the stream data */,
);
```

[See complete example](https://github.com/erezrokah/serverless-monorepo-app/blob/master/services/kinesis-service/e2e/handler.chai.test.ts)

### `to.have.message()`

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
  }).to.have.message(
    /* predicate to match with the messages in the queue */
    message =>
      message.Subject === 'Some Subject' && message.Message === 'Some Message',
  );
} finally {
  // unsubscribe from SNS topic and delete SQS queue
  await unsubscribeFromTopic(region, subscriptionArn, queueUrl);
}
```

[See complete example](https://github.com/erezrokah/serverless-monitoring-app/blob/master/services/monitoring-tester-service/e2e/checkEndpointStepFunction.chai.test.ts)
