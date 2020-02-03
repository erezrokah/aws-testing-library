import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import { toHaveObject } from './s3';

jest.mock('../common');
jest.mock('../utils/s3');
jest.spyOn(console, 'error');
jest.mock('jest-diff', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('s3 matchers', () => {
  describe('toHaveObject', () => {
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
    const region = 'region';
    const bucket = 'bucket';
    const props = { region, bucket };
    const key = 'key';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getObject error', async () => {
      const { verifyProps } = require('../common');
      const { getObject } = require('../utils/s3');

      const error = new Error('Unknown error');
      getObject.mockReturnValue(Promise.reject(error));

      expect.assertions(7);
      await expect(toHaveObject.bind(matcherUtils)(props, key)).rejects.toBe(
        error,
      );
      expect(getObject).toHaveBeenCalledTimes(1);
      expect(getObject).toHaveBeenCalledWith(props.region, props.bucket, key);
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error while looking for object: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, key }, [
        'region',
        'bucket',
        'key',
      ]);
    });

    test('should not pass on getObject not found', async () => {
      const { getObject } = require('../utils/s3');

      getObject.mockReturnValue(Promise.resolve({ body: null, found: false }));

      const { message, pass } = await toHaveObject.bind(matcherUtils)(
        props,
        key,
      );

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveObject${EOL}${EOL}Expected ${bucket} at region ${region} to have object with key ${key}${EOL}`,
      );
    });

    test('should pass on getObject found', async () => {
      const { getObject } = require('../utils/s3');

      getObject.mockReturnValue(
        Promise.resolve({ body: Buffer.from('some data'), found: true }),
      );

      const { message, pass } = await toHaveObject.bind(matcherUtils)(
        props,
        key,
      );

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveObject${EOL}${EOL}Expected ${bucket} at region ${region} not to have object with key ${key}${EOL}`,
      );
    });

    test('should not pass on getObject buffer not matching', async () => {
      const diff = require('jest-diff').default;
      const diffString = 'diffString';
      diff.mockReturnValue(diffString);

      matcherUtils.equals.mockReturnValue(false);

      const { getObject } = require('../utils/s3');

      const received = Buffer.from('actual');
      getObject.mockReturnValue(
        Promise.resolve({ body: received, found: true }),
      );

      const expected = Buffer.from('expected');
      const { message, pass } = await toHaveObject.bind(matcherUtils)(
        props,
        key,
        expected,
      );

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveObject${EOL}${EOL}Expected object ${received} to equal ${expected}${EOL}Difference:${EOL}${EOL}${diffString}`,
      );
      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(expected, received);
      expect(diff).toHaveBeenCalledTimes(1);
      expect(diff).toHaveBeenCalledWith(expected, received, {
        expand: true,
      });
    });

    test('should not pass on getObject buffer not matching empty diffString', async () => {
      const diff = require('jest-diff').default;
      const diffString = '';
      diff.mockReturnValue(diffString);

      matcherUtils.equals.mockReturnValue(false);

      const { getObject } = require('../utils/s3');

      const received = Buffer.from('actual');
      getObject.mockReturnValue(
        Promise.resolve({ body: received, found: true }),
      );

      const expected = Buffer.from('expected');
      const { message, pass } = await toHaveObject.bind(matcherUtils)(
        props,
        key,
        expected,
      );

      expect(pass).toBeFalsy();
      expect(message()).toEqual(
        `.toHaveObject${EOL}${EOL}Expected object ${received} to equal ${expected}${EOL}Difference:`,
      );
    });

    test('should  pass on getObject buffer matching', async () => {
      const diff = require('jest-diff').default;

      matcherUtils.equals.mockReturnValue(true);

      const { getObject } = require('../utils/s3');

      const received = Buffer.from('actual');
      getObject.mockReturnValue(
        Promise.resolve({ body: received, found: true }),
      );

      const expected = Buffer.from('expected');
      const { message, pass } = await toHaveObject.bind(matcherUtils)(
        props,
        key,
        expected,
      );

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveObject${EOL}${EOL}Expected object ${received} not to equal ${expected}`,
      );
      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(expected, received);
      expect(diff).toHaveBeenCalledTimes(0);
    });
  });
});
