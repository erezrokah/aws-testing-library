/* eslint-disable @typescript-eslint/no-var-requires */
import * as originalUtils from 'jest-matcher-utils';
import { EOL } from 'os';
import { toBeAtState, toHaveState } from './stepFunctions';

jest.mock('../common');
jest.mock('../utils/stepFunctions');
jest.spyOn(console, 'error');
jest.mock('jest-diff', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('stepFunctions matchers', () => {
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
  const stateMachineArn = 'stateMachineArn';
  const props = { region, stateMachineArn };
  const expectedState = 'expectedState';

  describe('toBeAtState', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getCurrentState error', async () => {
      const { verifyProps } = require('../common');
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
      const diff = require('jest-diff').default;
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
      const diff = require('jest-diff').default;
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
      const diff = require('jest-diff').default;

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

  describe('toHaveState', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getStates error', async () => {
      const { verifyProps } = require('../common');
      const { getStates } = require('../utils/stepFunctions');

      const error = new Error('Unknown error');
      getStates.mockReturnValue(Promise.reject(error));

      expect.assertions(7);
      await expect(
        toHaveState.bind(matcherUtils)(props, expectedState),
      ).rejects.toBe(error);
      expect(getStates).toHaveBeenCalledTimes(1);
      expect(getStates).toHaveBeenCalledWith(
        props.region,
        props.stateMachineArn,
      );
      expect(console.error).toHaveBeenCalledTimes(1);
      expect(console.error).toHaveBeenCalledWith(
        `Unknown error getting state machine states: ${error.message}`,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith(
        { ...props, state: expectedState },
        ['region', 'stateMachineArn', 'state'],
      );
    });

    test('should not pass when state is missing', async () => {
      const { getStates } = require('../utils/stepFunctions');

      const states = ['state1', 'state2'];
      getStates.mockReturnValue(Promise.resolve(states));

      const { message, pass } = await toHaveState.bind(matcherUtils)(
        props,
        expectedState,
      );

      expect(pass).toBeFalsy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.toHaveState${EOL}${EOL}Expected ${stateMachineArn} at region ${region} to have state ${expectedState}${EOL}` +
          `Found states: ${JSON.stringify(states)}`,
      );
    });

    test('should pass when state exists', async () => {
      const { getStates } = require('../utils/stepFunctions');

      const states = ['state1', 'state2', expectedState];
      getStates.mockReturnValue(Promise.resolve(states));

      const { message, pass } = await toHaveState.bind(matcherUtils)(
        props,
        expectedState,
      );

      expect(pass).toBeTruthy();
      expect(message).toEqual(expect.any(Function));
      expect(message()).toEqual(
        `.not.toHaveState${EOL}${EOL}Expected ${stateMachineArn} at region ${region} not to have state ${expectedState}${EOL}`,
      );
    });
  });
});
