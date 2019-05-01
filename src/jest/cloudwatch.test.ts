import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import { toHaveLog } from './cloudwatch';

jest.mock('../common');
jest.mock('../utils/cloudwatch');
jest.spyOn(console, 'error');

describe('cloudwatch matchers', () => {
  describe('toHaveLog', () => {
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
    const functionName = 'functionName';
    const props = { region, function: functionName };
    const pattern = 'pattern';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on filterLogEvents error', async () => {
      const { verifyProps } = require('../common');
      const { filterLogEvents } = require('../utils/cloudwatch');

      const error = new Error('Unknown error');
      filterLogEvents.mockReturnValue(Promise.reject(error));

      expect.assertions(7);
      await expect(toHaveLog.bind(matcherUtils)(props, pattern)).rejects.toBe(
        error,
      );
      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        props.region,
        props.function,
        pattern,
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error while matching log: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, pattern }, [
        'region',
        'function',
        'pattern',
      ]);
    });

    test('should not pass when no events found', async () => {
      const { filterLogEvents } = require('../utils/cloudwatch');

      const events: string[] = [];
      filterLogEvents.mockReturnValue(Promise.resolve({ events }));

      const { message, pass } = await toHaveLog.bind(matcherUtils)(
        props,
        pattern,
      );

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveLog${EOL}${EOL}Expected ${functionName} at region ${region} to have log matching pattern ${pattern}${EOL}`,
      );
    });

    test('should pass when events found', async () => {
      const { filterLogEvents } = require('../utils/cloudwatch');

      const events = ['someFakeEvent'];

      filterLogEvents.mockReturnValue(Promise.resolve({ events }));

      const { message, pass } = await toHaveLog.bind(matcherUtils)(
        props,
        pattern,
      );

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveLog${EOL}${EOL}Expected ${functionName} at region ${region} not to have log matching pattern ${pattern}${EOL}`,
      );
    });
  });
});
