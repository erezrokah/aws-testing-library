import { Method } from 'axios';
import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import { toReturnResponse } from './api';

jest.mock('../common');
jest.mock('../utils/api');
jest.spyOn(console, 'error');
jest.mock('jest-diff');

describe('api matchers', () => {
  describe('toReturnResponse', () => {
    const matcherUtils = ({
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
    } as unknown) as jest.MatcherUtils & { equals: jest.Mock };
    const url = 'url';
    const method = 'POST' as Method;
    const params = { param1: 'param1' };
    const data = { data1: 'data1' };
    const headers = { header1: 'header1' };

    const props = { url, method, params, data, headers };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getResponse error', async () => {
      const { verifyProps } = require('../common');
      const { getResponse } = require('../utils/api');

      const error = new Error('Unknown error');
      getResponse.mockReturnValue(Promise.reject(error));

      const expected = { statusCode: 200, data: { id: 'id' } };

      expect.assertions(7);
      await expect(
        toReturnResponse.bind(matcherUtils)(props, expected),
      ).rejects.toBe(error);

      expect(getResponse).toHaveBeenCalledTimes(1);
      expect(getResponse).toHaveBeenCalledWith(
        url,
        method,
        params,
        data,
        headers,
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error while getting response: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props }, ['url', 'method']);
    });

    test('should not pass on response not matching', async () => {
      const diff = require('jest-diff');
      const diffString = 'diffString';
      diff.mockReturnValue(diffString);

      matcherUtils.equals.mockReturnValue(false);

      const { getResponse } = require('../utils/api');

      const received = { statusCode: 200, data: { id: 'someItem' } };
      getResponse.mockReturnValue(Promise.resolve(received));

      const expected = { statusCode: 200, data: { id: 'otherItem' } };
      const { message, pass } = await toReturnResponse.bind(matcherUtils)(
        props,
        expected,
      );

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toReturnResponse${EOL}${EOL}Expected response ${received} to equal ${expected}${EOL}Difference:${EOL}${EOL}${diffString}${EOL}Request data: ${method}: ${url}`,
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

      const { getResponse } = require('../utils/api');

      const received = {
        data: { message: 'error' },
        statusCode: 500,
      };
      getResponse.mockReturnValue(Promise.resolve(received));

      const expected = {
        data: { message: 'hello' },
        statusCode: 200,
      };
      const { message, pass } = await toReturnResponse.bind(matcherUtils)(
        props,
        expected,
      );

      expect(pass).toBeFalsy();
      expect(message()).toEqual(
        `.toReturnResponse${EOL}${EOL}Expected response ${received} to equal ${expected}${EOL}Difference:${EOL}Request data: ${method}: ${url}`,
      );
    });

    test('should pass on getItem item matching', async () => {
      const diff = require('jest-diff');

      matcherUtils.equals.mockReturnValue(true);

      const { getResponse } = require('../utils/api');

      const received = {
        data: { message: 'hello' },
        statusCode: 200,
      };
      getResponse.mockReturnValue(Promise.resolve(received));

      const expected = {
        data: { message: 'hello' },
        statusCode: 200,
      };
      const { message, pass } = await toReturnResponse.bind(matcherUtils)(
        props,
        expected,
      );

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toReturnResponse${EOL}${EOL}Expected response ${received} not to equal ${expected}.${EOL}Request data: ${method}: ${url}`,
      );
      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(expected, received);
      expect(diff).toHaveBeenCalledTimes(0);
    });
  });
});
