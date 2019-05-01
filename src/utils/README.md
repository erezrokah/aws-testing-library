## Utils

- [invoke()](#invoke)
- [clearAllItems()](#clearallitems)
- [writeItems()](#writeitems)
- [clearAllObjects()](#clearallobjects)
- [deleteAllLogs()](#deletealllogs)
- [stopRunningExecutions()](#stoprunningexecutions)
- [deploy()](#deploy)

### `invoke()`

Invokes a lambda function

```typescript
const { invoke } = require('aws-testing-library/lib/utils/lambda');

const result = await invoke(
  'us-east-1',
  'functionName',
  {
    body: JSON.stringify({ text: 'from e2e test' }),
  } /* optional: payload for the lambda */,
);
```

### `clearAllItems()`

Clear all items in a DynamoDb table

```typescript
const { clearAllItems } = require('aws-testing-library/lib/utils/dynamoDb');

await clearAllItems('us-east-1', 'dynamo-db-table');
```

### `writeItems()`

Write items to a DynamoDb table

```typescript
const { writeItems } = require('aws-testing-library/lib/utils/dynamoDb');

const items = require('./seed.json');

await writeItems('us-east-1', 'dynamo-db-table', items);
```

### `clearAllObjects()`

Clear all objects in a s3 bucket

```typescript
const { clearAllObjects } = require('aws-testing-library/lib/utils/s3');

await clearAllObjects(
  'us-east-1',
  's3-bucket',
  'key-prefix' /* optional, only delete objects with keys that begin with the specified prefix*/,
);
```

### `deleteAllLogs()`

Clear all log streams for a lambda function

```typescript
const { deleteAllLogs } = require('aws-testing-library/lib/utils/cloudwatch');

await deleteAllLogs('us-east-1', 'lambda-function-name');
```

### `stopRunningExecutions()`

Stop all running executions for a state machine

```typescript
const {
  stopRunningExecutions,
} = require('aws-testing-library/lib/utils/stepFunctions');

await stopRunningExecutions('us-east-1', 'state-machine-arn');
```

### `deploy()`

Deploys the current service using [Serverless framework](https://serverless.com/)

```typescript
const { deploy } = require('aws-testing-library/lib/utils/serverless');

await deploy('dev' /* optional - deployment stage */);
```
