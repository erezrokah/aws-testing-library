import { AttributeMap, Key } from 'aws-sdk/clients/dynamodb';
import { wrapWithRetries } from './matchers/common';
import { toHaveItem } from './matchers/dynamoDb';
import { toHaveObject } from './matchers/s3';

declare global {
  namespace jest {
    // tslint:disable-next-line:interface-name
    interface Matchers<R> {
      toHaveItem: (key: Key, expectedItem?: AttributeMap) => R;
      toHaveObject: (key: string, expectedItem?: Buffer) => R;
    }
  }
}

expect.extend({
  toHaveItem: wrapWithRetries(toHaveItem) as typeof toHaveItem,
  toHaveObject: wrapWithRetries(toHaveObject) as typeof toHaveObject,
});

jest.setTimeout(60000);
