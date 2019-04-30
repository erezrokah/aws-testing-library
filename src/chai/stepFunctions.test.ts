import chai = require('chai');
import './';
import stepFunctions from './stepFunctions';

jest.mock('../common');
jest.mock('../utils/stepFunctions');
jest.mock('./utils', () => {
  return { wrapWithRetries: jest.fn(f => f) };
});

chai.use(stepFunctions);

describe('stepFunctions', () => {
  const region = 'region';
  const stateMachineArn = 'stateMachineArn';
  const props = { region, stateMachineArn };
  const state = 'expectedState';

  describe('atState', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getCurrentState error', async () => {
      const { verifyProps } = require('../common');
      const { getCurrentState } = require('../utils/stepFunctions');
      const { wrapWithRetries } = require('./utils');

      const error = new Error('Unknown error');
      getCurrentState.mockReturnValue(Promise.reject(error));

      expect.assertions(6);

      let received = null;
      try {
        await chai.expect(props).to.be.atState(state);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, state }, [
        'region',
        'stateMachineArn',
        'state',
      ]);

      expect(getCurrentState).toHaveBeenCalledTimes(1);
      expect(getCurrentState).toHaveBeenCalledWith(region, stateMachineArn);

      expect(wrapWithRetries).toHaveBeenCalledTimes(1);
    });

    test('should pass on be at state', async () => {
      const { getCurrentState } = require('../utils/stepFunctions');

      getCurrentState.mockReturnValue(Promise.resolve(state));

      expect.assertions(2);

      // should not throw error on state exists
      await chai.expect(props).to.be.atState(state);

      try {
        // should throw error on state not found
        getCurrentState.mockReturnValue(Promise.resolve('other state'));
        await chai.expect(props).to.be.atState(state);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${stateMachineArn} to be at state ${state}`,
        );
      }
    });

    test('should pass on not be at state', async () => {
      const { getCurrentState } = require('../utils/stepFunctions');

      getCurrentState.mockReturnValue(Promise.resolve('other state'));

      expect.assertions(2);

      // should not throw error on state not found
      await chai.expect(props).to.not.be.atState(state);

      try {
        // should throw error on state exists
        getCurrentState.mockReturnValue(Promise.resolve(state));
        await chai.expect(props).to.not.be.atState(state);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${stateMachineArn} not to be at state ${state}`,
        );
      }
    });
  });

  describe('state', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on getStates error', async () => {
      const { verifyProps } = require('../common');
      const { getStates } = require('../utils/stepFunctions');

      const error = new Error('Unknown error');
      getStates.mockReturnValue(Promise.reject(error));

      expect.assertions(5);

      let received = null;
      try {
        await chai.expect(props).to.have.state(state);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, state }, [
        'region',
        'stateMachineArn',
        'state',
      ]);

      expect(getStates).toHaveBeenCalledTimes(1);
      expect(getStates).toHaveBeenCalledWith(region, stateMachineArn);
    });

    test('should pass on have state', async () => {
      const { getStates } = require('../utils/stepFunctions');

      getStates.mockReturnValue(Promise.resolve([state]));

      expect.assertions(2);

      // should not throw error on state exists
      await chai.expect(props).to.have.state(state);

      try {
        // should throw error on state not found
        getStates.mockReturnValue(Promise.resolve([]));
        await chai.expect(props).to.have.state(state);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${stateMachineArn} to have state ${state}`,
        );
      }
    });

    test('should pass on not have state', async () => {
      const { getStates } = require('../utils/stepFunctions');

      getStates.mockReturnValue(Promise.resolve([]));

      expect.assertions(2);

      // should not throw error on state not found
      await chai.expect(props).to.not.have.state(state);

      try {
        // should throw error on state exists
        getStates.mockReturnValue(Promise.resolve([state]));
        await chai.expect(props).to.not.have.state(state);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${stateMachineArn} not to have state ${state}`,
        );
      }
    });
  });
});
