import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import { toHaveItem } from './dynamoDb';

jest.mock('../common');
jest.mock('../utils/dynamoDb');
jest.spyOn(console, 'error');
jest.mock('jest-diff');

describe('dynamoDb matchers', () => {
  describe('toHaveItem', () => {
    const matcherUtils = {
      equals: jest.fn(),
      expand: true,
      isNot: false,
      utils: {
        ...originalUtils,
        diff: jest.fn() as any,
        getType: jest.fn(),
        matcherHint: jest.fn(i => i),
        printExpected: jest.fn(i => i),
        printReceived: jest.fn(i => i),
      },
    };
    const region = 'region';
    const table = 'table';
    const props = { region, table };
    const key = { id: { S: 'id' } };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getItem error', async () => {
      const { verifyProps } = require('../common');
      const { getItem } = require('../utils/dynamoDb');

      const error = new Error('Unknown error');
      getItem.mockReturnValue(Promise.reject(error));

      expect.assertions(7);
      await expect(toHaveItem.bind(matcherUtils)(props, key)).rejects.toBe(
        error,
      );
      expect(getItem).toHaveBeenCalledTimes(1);
      expect(getItem).toHaveBeenCalledWith(props.region, props.table, key);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error while looking for item: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, key }, [
        'region',
        'table',
        'key',
      ]);
    });

    test('should not pass on getItem not found', async () => {
      const { getItem } = require('../utils/dynamoDb');

      getItem.mockReturnValue(Promise.resolve(undefined));

      const { message, pass } = await toHaveItem.bind(matcherUtils)(props, key);

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveItem${EOL}${EOL}Expected ${table} at region ${region} to have item with key ${key}${EOL}`,
      );
    });

    test('should pass on getItem found', async () => {
      const { getItem } = require('../utils/dynamoDb');

      getItem.mockReturnValue(Promise.resolve('someItem'));

      const { message, pass } = await toHaveItem.bind(matcherUtils)(props, key);

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveItem${EOL}${EOL}Expected ${table} at region ${region} not to have item with key ${key}${EOL}`,
      );
    });

    test('should not pass on getItem item not matching', async () => {
      const diff = require('jest-diff');
      const diffString = 'diffString';
      diff.mockReturnValue(diffString);

      matcherUtils.equals.mockReturnValue(false);

      const { getItem } = require('../utils/dynamoDb');

      const received = { id: { S: 'someItem' } };
      getItem.mockReturnValue(Promise.resolve(received));

      const expected = { id: { S: 'otherItem' } };
      const { message, pass } = await toHaveItem.bind(matcherUtils)(
        props,
        key,
        expected,
      );

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveItem${EOL}${EOL}Expected item ${received} to equal ${expected}${EOL}Difference:${EOL}${EOL}${diffString}`,
      );
      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(expected, received);
      expect(diff).toHaveBeenCalledTimes(1);
      expect(diff).toHaveBeenCalledWith(expected, received, {
        expand: true,
      });
    });

    test('should not pass on getItem item not matching empty diffString', async () => {
      const diff = require('jest-diff');
      const diffString = '';
      diff.mockReturnValue(diffString);

      matcherUtils.equals.mockReturnValue(false);

      const { getItem } = require('../utils/dynamoDb');

      const received = {
        id: { S: 'someId' },
        text: { S: 'someText' },
        timestamp: { N: new Date('1948/1/1').getTime().toString() },
      };
      getItem.mockReturnValue(Promise.resolve(received));

      const expected = {
        id: { S: 'someId' },
        text: { S: 'someText' },
        timestamp: { N: new Date('1949/1/1').getTime().toString() },
      };
      const { message, pass } = await toHaveItem.bind(matcherUtils)(
        props,
        key,
        expected,
      );

      expect(pass).toBeFalsy();
      expect(message()).toEqual(
        `.toHaveItem${EOL}${EOL}Expected item ${received} to equal ${expected}${EOL}Difference:`,
      );
    });

    test('should pass on getItem item matching', async () => {
      const diff = require('jest-diff');

      matcherUtils.equals.mockReturnValue(true);

      const { getItem } = require('../utils/dynamoDb');

      const timestamp = { N: new Date().getTime().toString() };
      const received = {
        id: { S: 'someId' },
        text: { S: 'someText' },
        timestamp,
      };
      getItem.mockReturnValue(Promise.resolve(received));

      const expected = {
        id: { S: 'someId' },
        text: { S: 'someText' },
        timestamp,
      };
      const { message, pass } = await toHaveItem.bind(matcherUtils)(
        props,
        key,
        expected,
      );

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveItem${EOL}${EOL}Expected item ${received} not to equal ${expected}`,
      );
      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(expected, received);
      expect(diff).toHaveBeenCalledTimes(0);
    });

    test('should pass on getItem item matching, non strict mode', async () => {
      matcherUtils.equals.mockReturnValue(true);

      const { getItem } = require('../utils/dynamoDb');

      const id = { S: 'someId' };
      const text = { S: 'text' };
      const received = {
        id,
        text,
        timestamp: { N: new Date().getTime().toString() },
      };
      getItem.mockReturnValue(Promise.resolve(received));

      const expected = {
        id,
        text,
      };
      const { message, pass } = await toHaveItem.bind(matcherUtils)(
        props,
        key,
        expected,
        false,
      );

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveItem${EOL}${EOL}Expected item ${received} not to equal ${expected}`,
      );
      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(expected, { id, text });
    });
  });
});
