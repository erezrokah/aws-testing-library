import { EOL } from 'os';
import { toBeAtState } from './stepFunctions';

jest.mock('./common');
jest.mock('../utils/stepFunctions');
jest.spyOn(console, 'error');
jest.mock('jest-diff');

describe('stepFunctions matchers', () => {
  describe('toBeAtState', () => {
    const matcherUtils = {
      equals: jest.fn(),
      utils: {
        matcherHint: jest.fn(i => i),
        printExpected: jest.fn(i => i),
        printReceived: jest.fn(i => i),
      },
    };
    const region = 'region';
    const stateMachineArn = 'stateMachineArn';
    const props = { region, stateMachineArn };
    const expectedState = 'expectedState';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getCurrentState error', async () => {
      const { verifyProps } = require('./common');
      const { getCurrentState } = require('../utils/stepFunctions');

      const error = new Error('Unknown error');
      getCurrentState.mockReturnValue(Promise.reject(error));

      expect.assertions(7);
      await expect(
        toBeAtState.bind(matcherUtils)(props, expectedState),
      ).rejects.toBe(error);
      expect(getCurrentState).toHaveBeenCalledTimes(1);
      expect(getCurrentState).toHaveBeenCalledWith(
        props.region,
        props.stateMachineArn,
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error getting state machine state: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith(
        { ...props, state: expectedState },
        ['region', 'stateMachineArn', 'state'],
      );
    });

    test('should not pass when wrong state', async () => {
      const diff = require('jest-diff');
      const diffString = 'diffString';
      diff.mockReturnValue(diffString);

      matcherUtils.equals.mockReturnValue(false);

      const { getCurrentState } = require('../utils/stepFunctions');

      const receivedState = 'receivedState';
      getCurrentState.mockReturnValue(Promise.resolve(receivedState));

      const { message, pass } = await toBeAtState.bind(matcherUtils)(
        props,
        expectedState,
      );

      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(
        expectedState,
        receivedState,
      );
      expect(diff).toHaveBeenCalledTimes(1);
      expect(diff).toHaveBeenCalledWith(expectedState, receivedState, {
        expand: true,
      });

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toBeAtState${EOL}${EOL}Expected ${stateMachineArn} at region ${region} to be at state ${expectedState}${EOL}` +
          `Difference:${EOL}${EOL}${diffString}`,
      );
    });

    test('should not pass when wrong state empty diffString', async () => {
      const diff = require('jest-diff');
      const diffString = '';
      diff.mockReturnValue(diffString);

      matcherUtils.equals.mockReturnValue(false);

      const { getCurrentState } = require('../utils/stepFunctions');

      const receivedState = 'receivedState';
      getCurrentState.mockReturnValue(Promise.resolve(receivedState));

      const { message } = await toBeAtState.bind(matcherUtils)(
        props,
        expectedState,
      );

      expect(message()).toEqual(
        `.toBeAtState${EOL}${EOL}Expected ${stateMachineArn} at region ${region} to be at state ${expectedState}${EOL}Difference:`,
      );
    });

    test('should pass when correct state', async () => {
      const diff = require('jest-diff');

      matcherUtils.equals.mockReturnValue(true);

      const { getCurrentState } = require('../utils/stepFunctions');

      const receivedState = expectedState;
      getCurrentState.mockReturnValue(Promise.resolve(receivedState));

      const { message, pass } = await toBeAtState.bind(matcherUtils)(
        props,
        expectedState,
      );

      expect(matcherUtils.equals).toHaveBeenCalledTimes(1);
      expect(matcherUtils.equals).toHaveBeenCalledWith(
        expectedState,
        receivedState,
      );
      expect(diff).toHaveBeenCalledTimes(0);

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toBeAtState${EOL}${EOL}Expected ${stateMachineArn} at region ${region} not to be at state ${expectedState}${EOL}`,
      );
    });
  });
});
