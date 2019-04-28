import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import { toHaveRecord } from './kinesis';

jest.mock('../common');
jest.mock('../utils/kinesis');
jest.spyOn(console, 'error');

describe('kinesis matchers', () => {
  describe('toHaveRecord', () => {
    const matcherUtils = {
      equals: jest.fn(),
      expand: true,
      isNot: false,
      utils: {
        ...originalUtils,
        diff: jest.fn(),
        getType: jest.fn(),
        matcherHint: jest.fn(i => i),
        printExpected: jest.fn(i => i),
        printReceived: jest.fn(i => i),
      },
    };
    const region = 'region';
    const stream = 'stream';
    const props = { region, stream };
    const matcher = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on existsInStream error', async () => {
      const { verifyProps } = require('../common');
      const { existsInStream } = require('../utils/kinesis');

      const error = new Error('Unknown error');
      existsInStream.mockReturnValue(Promise.reject(error));

      expect.assertions(7);
      await expect(
        toHaveRecord.bind(matcherUtils)(props, matcher),
      ).rejects.toBe(error);
      expect(existsInStream).toHaveBeenCalledTimes(1);
      expect(existsInStream).toHaveBeenCalledWith(
        props.region,
        props.stream,
        matcher,
        10000,
        500,
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error while looking for record: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, matcher }, [
        'region',
        'stream',
        'matcher',
      ]);
    });

    test('should not pass on existsInStream returns false', async () => {
      const { existsInStream } = require('../utils/kinesis');

      existsInStream.mockReturnValue(Promise.resolve(false));

      const { message, pass } = await toHaveRecord.bind(matcherUtils)(
        props,
        matcher,
      );

      expect.assertions(3);

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveRecord${EOL}${EOL}Expected ${stream} at region ${region} to have record`,
      );
    });

    test('should pass on existsInStream returns true', async () => {
      const { existsInStream } = require('../utils/kinesis');

      existsInStream.mockReturnValue(Promise.resolve(true));

      const { message, pass } = await toHaveRecord.bind(matcherUtils)(
        props,
        matcher,
      );

      expect.assertions(3);

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveRecord${EOL}${EOL}Expected ${stream} at region ${region} not to have record`,
      );
    });
  });
});
