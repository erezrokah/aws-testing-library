/* eslint-disable @typescript-eslint/no-var-requires */
import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import * as common from '../common';
import { toHaveLog } from './cloudwatch';

jest.mock('../utils/cloudwatch');
jest.spyOn(console, 'error');

jest.spyOn(Date, 'parse').mockImplementation(() => 12 * 60 * 60 * 1000);
jest.spyOn(common, 'verifyProps');
jest.spyOn(common, 'epochDateMinusHours');

describe('cloudwatch matchers', () => {
  describe('toHaveLog', () => {
    const matcherUtils = {
      equals: jest.fn(),
      expand: true,
      isNot: false,
      utils: {
        ...originalUtils,
        diff: jest.fn() as unknown,
        getType: jest.fn(),
        matcherHint: jest.fn((i) => i),
        printExpected: jest.fn((i) => i),
        printReceived: jest.fn((i) => i),
      },
    } as unknown as jest.MatcherUtils & { equals: jest.Mock };
    const region = 'region';
    const functionName = 'functionName';
    const startTime = 12 * 60 * 60 * 1000;
    const props = { region, function: functionName, startTime };
    const pattern = 'pattern';

    beforeEach(() => {
      jest.clearAllMocks();

      const { getLogGroupName } = require('../utils/cloudwatch');
      getLogGroupName.mockImplementation(
        (functionName: string) => `/aws/lambda/${functionName}`,
      );
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
        `/aws/lambda/${props.function}`,
        startTime,
        pattern,
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error while matching log: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, pattern }, [
        'region',
        'pattern',
      ]);
    });

    test('startTime should be defaulted when not passed in', async () => {
      const { epochDateMinusHours, verifyProps } = require('../common');
      const { filterLogEvents } = require('../utils/cloudwatch');

      const events: string[] = [];
      filterLogEvents.mockReturnValue(Promise.resolve({ events }));

      epochDateMinusHours.mockReturnValue(11 * 60 * 60 * 1000);

      const propsNoTime = { region, function: functionName };
      await toHaveLog.bind(matcherUtils)(propsNoTime, pattern);

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        propsNoTime.region,
        `/aws/lambda/${props.function}`,
        11 * 60 * 60 * 1000,
        pattern,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...propsNoTime, pattern }, [
        'region',
        'pattern',
      ]);
    });

    test('should pass custom log group name to filterLogEvents', async () => {
      const { filterLogEvents } = require('../utils/cloudwatch');

      filterLogEvents.mockReturnValue(Promise.resolve({ events: ['event'] }));

      await toHaveLog.bind(matcherUtils)(
        { ...props, logGroupName: 'customLogGroup' },
        pattern,
      );

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        props.region,
        'customLogGroup',
        props.startTime,
        pattern,
      );
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
