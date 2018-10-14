import { AttributeMap, Key } from 'aws-sdk/clients/dynamodb';
import { toHaveLog } from './matchers/cloudwatch';
import { wrapWithRetries } from './matchers/common';
import { toHaveItem } from './matchers/dynamoDb';
import { toHaveObject } from './matchers/s3';

declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R> {
      toHaveItem: (key: Key, expectedItem?: AttributeMap) => R;
      toHaveObject: (key: string, expectedItem?: Buffer) => R;
      toHaveLog: (pattern: string) => R;
    }
  }
}

expect.extend({
  toHaveItem: wrapWithRetries(toHaveItem) as typeof toHaveItem,
  toHaveLog: wrapWithRetries(toHaveLog) as typeof toHaveLog,
  toHaveObject: wrapWithRetries(toHaveObject) as typeof toHaveObject,
});

jest.setTimeout(60000);
