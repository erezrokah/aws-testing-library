import { IExpectedResponse } from '../common/api';
import { IRecordMatcher } from '../utils/kinesis';
import { IMessageMatcher } from '../utils/sqs';
import { toReturnResponse } from './api';
import { toHaveLog } from './cloudwatch';
import { toHaveItem } from './dynamoDb';
import { toHaveRecord } from './kinesis';
import { toHaveObject } from './s3';
import { toHaveMessage } from './sqs';
import { toBeAtState, toHaveState } from './stepFunctions';
import { wrapWithRetries, wrapWithRetryUntilPass } from './utils';

declare global {
  namespace jest {
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
      toHaveMessage: (matcher: IMessageMatcher) => R;
      toHaveState: (state: string) => R;
      toReturnResponse: (expected: IExpectedResponse) => R;
    }
  }
}

expect.extend({
  toBeAtState: wrapWithRetries(toBeAtState) as typeof toBeAtState,
  toHaveItem: wrapWithRetries(toHaveItem) as typeof toHaveItem,
  toHaveLog: wrapWithRetryUntilPass(toHaveLog) as typeof toHaveLog,
  toHaveMessage: wrapWithRetries(toHaveMessage) as typeof toHaveMessage,
  toHaveObject: wrapWithRetries(toHaveObject) as typeof toHaveObject,
  toHaveRecord, // has built in timeout mechanism due to how kinesis consumer works
  toHaveState: wrapWithRetries(toHaveState) as typeof toHaveState,
  toReturnResponse, // synchronous so no need to retry
});

jest.setTimeout(60000);
