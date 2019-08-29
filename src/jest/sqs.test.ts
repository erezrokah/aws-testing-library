import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import { toHaveMessage } from './sqs';

jest.mock('../common');
jest.mock('../utils/sqs');
jest.spyOn(console, 'error');

describe('sqs matchers', () => {
  describe('toHaveRecord', () => {
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
    const queueUrl = 'queueUrl';
    const props = { region, queueUrl };
    const matcher = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on existsInQueue error', async () => {
      const { verifyProps } = require('../common');
      const { existsInQueue } = require('../utils/sqs');

      const error = new Error('Unknown error');
      existsInQueue.mockReturnValue(Promise.reject(error));

      expect.assertions(7);
      await expect(
        toHaveMessage.bind(matcherUtils)(props, matcher),
      ).rejects.toBe(error);
      expect(existsInQueue).toHaveBeenCalledTimes(1);
      expect(existsInQueue).toHaveBeenCalledWith(
        props.region,
        props.queueUrl,
        matcher,
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error while looking for message: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, matcher }, [
        'region',
        'queueUrl',
        'matcher',
      ]);
    });

    test('should not pass on existsInQueue returns false', async () => {
      const { existsInQueue } = require('../utils/sqs');

      existsInQueue.mockReturnValue(Promise.resolve(false));

      const { message, pass } = await toHaveMessage.bind(matcherUtils)(
        props,
        matcher,
      );

      expect.assertions(3);

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveMessage${EOL}${EOL}Expected ${queueUrl} at region ${region} to have message`,
      );
    });

    test('should pass on existsInQueue returns true', async () => {
      const { existsInQueue } = require('../utils/sqs');

      existsInQueue.mockReturnValue(Promise.resolve(true));

      const { message, pass } = await toHaveMessage.bind(matcherUtils)(
        props,
        matcher,
      );

      expect.assertions(3);

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveMessage${EOL}${EOL}Expected ${queueUrl} at region ${region} not to have message`,
      );
    });
  });
});
