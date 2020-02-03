import diff from 'jest-diff';
import { EOL } from 'os';
import { verifyProps } from '../common';
import { expectedProps, IStepFunctionsProps } from '../common/stepFunctions';
import { getCurrentState, getStates } from '../utils/stepFunctions';

export const toBeAtState = async function(
  this: jest.MatcherUtils,
  props: IStepFunctionsProps,
  expected: string,
) {
  verifyProps({ ...props, state: expected }, expectedProps);

  const { region, stateMachineArn } = props;

  try {
    const printStateMachineArn = this.utils.printExpected(stateMachineArn);
    const printRegion = this.utils.printExpected(region);
    const printExpected = this.utils.printExpected(expected) + EOL;

    const notHint = this.utils.matcherHint('.not.toBeAtState') + EOL + EOL;
    const hint = this.utils.matcherHint('.toBeAtState') + EOL + EOL;

    const received = await getCurrentState(region, stateMachineArn);
    const pass = this.equals(expected, received);
    if (pass) {
      return {
        message: () =>
          `${notHint}Expected ${printStateMachineArn} at region ${printRegion} not to be at state ${printExpected}`,
        pass: true,
      };
    } else {
      const diffString = diff(expected, received, {
        expand: true,
      });
      return {
        message: () =>
          `${hint}Expected ${printStateMachineArn} at region ${printRegion} to be at state ${printExpected}` +
          `Difference:${diffString ? `${EOL}${EOL}${diffString}` : ''}`,
        pass: false,
      };
    }
  } catch (e) {
    console.error(`Unknown error getting state machine state: ${e.message}`);
    throw e;
  }
};

export const toHaveState = async function(
  this: jest.MatcherUtils,
  props: IStepFunctionsProps,
  expected: string,
) {
  verifyProps({ ...props, state: expected }, expectedProps);

  const { region, stateMachineArn } = props;

  try {
    const printStateMachineArn = this.utils.printExpected(stateMachineArn);
    const printRegion = this.utils.printExpected(region);
    const printExpected = this.utils.printExpected(expected) + EOL;

    const notHint = this.utils.matcherHint('.not.toHaveState') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveState') + EOL + EOL;

    const states = await getStates(region, stateMachineArn);
    const pass = states.includes(expected);
    if (pass) {
      return {
        message: () =>
          `${notHint}Expected ${printStateMachineArn} at region ${printRegion} not to have state ${printExpected}`,
        pass: true,
      };
    } else {
      return {
        message: () =>
          `${hint}Expected ${printStateMachineArn} at region ${printRegion} to have state ${printExpected}` +
          `Found states: ${JSON.stringify(states)}`,
        pass: false,
      };
    }
  } catch (e) {
    console.error(`Unknown error getting state machine states: ${e.message}`);
    throw e;
  }
};
