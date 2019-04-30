import { verifyProps } from '../common';
import { expectedProps, IStepFunctionsProps } from '../common/stepFunctions';
import { getCurrentState, getStates } from '../utils/stepFunctions';
import { wrapWithRetries } from './utils';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      atState: (state: string) => Assertion;
      state: (state: string) => Assertion;
    }
  }
}

const attemptAtState = async function(this: any, state: string) {
  const props = this._obj as IStepFunctionsProps;
  verifyProps({ ...props, state }, expectedProps);

  const { region, stateMachineArn } = props;

  const received = await getCurrentState(region, stateMachineArn);
  const pass = received === state;

  return {
    message: `expected ${stateMachineArn} to be at state ${state}`,
    negateMessage: `expected ${stateMachineArn} not to be at state ${state}`,
    pass,
  };
};

const attemptHaveState = async function(this: any, state: string) {
  const props = this._obj as IStepFunctionsProps;
  verifyProps({ ...props, state }, expectedProps);

  const { region, stateMachineArn } = props;

  const states = await getStates(region, stateMachineArn);
  const pass = states.includes(state);

  return {
    message: `expected ${stateMachineArn} to have state ${state}`,
    negateMessage: `expected ${stateMachineArn} not to have state ${state}`,
    pass,
  };
};

const stepFunctions = (chai: any) => {
  chai.Assertion.addMethod('atState', async function(this: any, state: string) {
    const wrapped = wrapWithRetries(attemptAtState);
    const { pass, message, negateMessage } = await wrapped.apply(this, [state]);

    this.assert(pass, message, negateMessage);
  });

  chai.Assertion.addMethod('state', async function(this: any, state: string) {
    const wrapped = wrapWithRetries(attemptHaveState);
    const { pass, message, negateMessage } = await wrapped.apply(this, [state]);

    this.assert(pass, message, negateMessage);
  });
};

export default stepFunctions;
