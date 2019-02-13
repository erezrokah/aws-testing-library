import { IExpectedResponse, toReturnResponse } from './matchers/api';
import { toHaveLog } from './matchers/cloudwatch';
import { wrapWithRetries } from './matchers/common';
import { toHaveItem } from './matchers/dynamoDb';
import { toHaveRecord } from './matchers/kinesis';
import { toHaveObject } from './matchers/s3';
import { toBeAtState, toHaveState } from './matchers/stepFunctions';
import { IRecordMatcher } from './utils/kinesis';

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
      toHaveRecord: (matcher: IRecordMatcher) => R;
      toHaveState: (state: string) => R;
      toReturnResponse: (expected: IExpectedResponse) => R;
    }
  }
}

expect.extend({
  toBeAtState: wrapWithRetries(toBeAtState) as typeof toBeAtState,
  toHaveItem: wrapWithRetries(toHaveItem) as typeof toHaveItem,
  toHaveLog: wrapWithRetries(toHaveLog) as typeof toHaveLog,
  toHaveObject: wrapWithRetries(toHaveObject) as typeof toHaveObject,
  toHaveRecord, // has built in timeout mechanism due to how kinesis consumer works
  toHaveState: wrapWithRetries(toHaveState) as typeof toHaveState,
  toReturnResponse, // synchronous so no need to retry
});

jest.setTimeout(60000);
