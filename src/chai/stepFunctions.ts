import { verifyProps } from '../common';
import { expectedProps, IStepFunctionsProps } from '../common/stepFunctions';
import { getCurrentState, getStates } from '../utils/stepFunctions';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      atState: (state: string) => Assertion;
      state: (state: string) => Assertion;
    }
  }
}

const stepFunctions = (chai: any) => {
  chai.Assertion.addMethod('atState', async function(this: any, state: string) {
    const props = this._obj as IStepFunctionsProps;
    verifyProps({ ...props, state }, expectedProps);

    const { region, stateMachineArn } = props;

    const received = await getCurrentState(region, stateMachineArn);
    const pass = received === state;

    this.assert(
      pass,
      `expected ${stateMachineArn} to be at state ${state}`,
      `expected ${stateMachineArn} not to be at state ${state}`,
    );
  });

  chai.Assertion.addMethod('state', async function(this: any, state: string) {
    const props = this._obj as IStepFunctionsProps;
    verifyProps({ ...props, state }, expectedProps);

    const { region, stateMachineArn } = props;

    const states = await getStates(region, stateMachineArn);
    const pass = states.includes(state);

    this.assert(
      pass,
      `expected ${stateMachineArn} to have state ${state}`,
      `expected ${stateMachineArn} not to have state ${state}`,
    );
  });
};

export default stepFunctions;
