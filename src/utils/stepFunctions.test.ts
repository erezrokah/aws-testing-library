import { getCurrentState, stopRunningExecutions } from './stepFunctions';

jest.mock('aws-sdk', () => {
  const stopExecutionValue = { promise: jest.fn() };
  const stopExecution = jest.fn(() => stopExecutionValue);
  const getExecutionHistoryValue = { promise: jest.fn() };
  const getExecutionHistory = jest.fn(() => getExecutionHistoryValue);
  const listExecutionsValue = { promise: jest.fn() };
  const listExecutions = jest.fn(() => listExecutionsValue);
  const StepFunctions = jest.fn(() => ({
    getExecutionHistory,
    listExecutions,
    stopExecution,
  }));
  return { StepFunctions };
});

describe('stepfunctions utils', () => {
  const AWS = require('aws-sdk');
  const stepFunctions = AWS.StepFunctions;

  const [region, stateMachineArn] = ['region', 'stateMachineArn'];

  describe('stopRunningExecutions', () => {
    test('should stop running executions', async () => {
      const listExecutions = stepFunctions().listExecutions;
      const stopExecution = stepFunctions().stopExecution;
      const promise = listExecutions().promise;
      const executions = [
        { executionArn: 'executionArn1' },
        { executionArn: 'executionArn2' },
      ];
      promise.mockReturnValue(Promise.resolve({ executions }));

      jest.clearAllMocks();

      await stopRunningExecutions(region, stateMachineArn);

      expect(listExecutions).toHaveBeenCalledTimes(1);
      expect(listExecutions).toHaveBeenCalledWith({
        stateMachineArn,
        statusFilter: 'RUNNING',
      });
      expect(stopExecution).toHaveBeenCalledTimes(executions.length);
      for (const execution of executions) {
        const { executionArn } = execution;
        expect(stopExecution).toHaveBeenCalledWith({
          executionArn,
        });
      }
    });
  });

  describe('getCurrentState', () => {
    test('should return undefined on no executions', async () => {
      const listExecutions = stepFunctions().listExecutions;
      const getExecutionHistory = stepFunctions().getExecutionHistory;
      const promise = listExecutions().promise;
      const executions: AWS.StepFunctions.ExecutionListItem[] = [];
      promise.mockReturnValue(Promise.resolve({ executions }));

      jest.clearAllMocks();

      const result = await getCurrentState(region, stateMachineArn);

      expect(getExecutionHistory).toHaveBeenCalledTimes(0);
      expect(listExecutions).toHaveBeenCalledTimes(1);
      expect(listExecutions).toHaveBeenCalledWith({
        stateMachineArn,
        statusFilter: 'RUNNING',
      });
      expect(result).toBeUndefined();
    });

    test('should return undefined on no history events', async () => {
      const listExecutions = stepFunctions().listExecutions;
      const getExecutionHistory = stepFunctions().getExecutionHistory;

      const listExecutionsPromise = listExecutions().promise;
      const executions = [
        { executionArn: 'executionArn1' },
        { executionArn: 'executionArn2' },
      ];
      listExecutionsPromise.mockReturnValue(Promise.resolve({ executions }));

      const getExecutionHistoryPromise = getExecutionHistory().promise;
      const events: AWS.StepFunctions.HistoryEvent[] = [];
      getExecutionHistoryPromise.mockReturnValue(Promise.resolve({ events }));

      jest.clearAllMocks();

      const result = await getCurrentState(region, stateMachineArn);

      expect(getExecutionHistory).toHaveBeenCalledTimes(1);
      expect(getExecutionHistory).toHaveBeenCalledWith({
        executionArn: executions[0].executionArn,
        reverseOrder: true,
      });
      expect(result).toBeUndefined();
    });

    test('should return stateEnteredEvent name', async () => {
      const listExecutions = stepFunctions().listExecutions;
      const getExecutionHistory = stepFunctions().getExecutionHistory;

      const listExecutionsPromise = listExecutions().promise;
      const executions = [
        { executionArn: 'executionArn1' },
        { executionArn: 'executionArn2' },
      ];
      listExecutionsPromise.mockReturnValue(Promise.resolve({ executions }));

      const getExecutionHistoryPromise = getExecutionHistory().promise;
      const events = [
        { stateEnteredEventDetails: { name: 'someEventName' } },
        { stateEnteredEventDetails: { name: 'otherEventName' } },
      ];
      getExecutionHistoryPromise.mockReturnValue(Promise.resolve({ events }));

      jest.clearAllMocks();

      const result = await getCurrentState(region, stateMachineArn);

      expect(result).toBe(events[0].stateEnteredEventDetails.name);
    });

    test('should return stateExitedEventDetails name', async () => {
      const listExecutions = stepFunctions().listExecutions;
      const getExecutionHistory = stepFunctions().getExecutionHistory;

      const listExecutionsPromise = listExecutions().promise;
      const executions = [
        { executionArn: 'executionArn1' },
        { executionArn: 'executionArn2' },
      ];
      listExecutionsPromise.mockReturnValue(Promise.resolve({ executions }));

      const getExecutionHistoryPromise = getExecutionHistory().promise;
      const events = [
        { stateExitedEventDetails: { name: 'someEventName' } },
        { stateExitedEventDetails: { name: 'otherEventName' } },
      ];
      getExecutionHistoryPromise.mockReturnValue(Promise.resolve({ events }));

      jest.clearAllMocks();

      const result = await getCurrentState(region, stateMachineArn);

      expect(result).toBe(events[0].stateExitedEventDetails.name);
    });

    test('should return undefined on missing event name', async () => {
      const listExecutions = stepFunctions().listExecutions;
      const getExecutionHistory = stepFunctions().getExecutionHistory;

      const listExecutionsPromise = listExecutions().promise;
      const executions = [
        { executionArn: 'executionArn1' },
        { executionArn: 'executionArn2' },
      ];
      listExecutionsPromise.mockReturnValue(Promise.resolve({ executions }));

      const getExecutionHistoryPromise = getExecutionHistory().promise;
      const events = [{}, {}];
      getExecutionHistoryPromise.mockReturnValue(Promise.resolve({ events }));

      jest.clearAllMocks();

      const result = await getCurrentState(region, stateMachineArn);

      expect(result).toBeUndefined();
    });
  });
});
