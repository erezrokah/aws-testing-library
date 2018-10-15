import { toHaveLog } from './matchers/cloudwatch';
import { wrapWithRetries } from './matchers/common';
import { toHaveItem } from './matchers/dynamoDb';
import { toHaveObject } from './matchers/s3';
import { toBeAtState } from './matchers/stepFunctions';

declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R> {
      toBeAtState: (state: string) => R;
      toHaveItem: (
        key: AWS.DynamoDB.DocumentClient.Key,
        expectedItem?: AWS.DynamoDB.DocumentClient.AttributeMap,
        strict?: boolean,
      ) => R;
      toHaveLog: (pattern: string) => R;
      toHaveObject: (key: string, expectedItem?: Buffer) => R;
    }
  }
}

expect.extend({
  toBeAtState: wrapWithRetries(toBeAtState) as typeof toBeAtState,
  toHaveItem: wrapWithRetries(toHaveItem) as typeof toHaveItem,
  toHaveLog: wrapWithRetries(toHaveLog) as typeof toHaveLog,
  toHaveObject: wrapWithRetries(toHaveObject) as typeof toHaveObject,
});

jest.setTimeout(60000);
