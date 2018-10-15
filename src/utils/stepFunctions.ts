import AWS = require('aws-sdk');

const getRunningExecutions = async (
  region: string,
  stateMachineArn: string,
) => {
  const stepFunctions = new AWS.StepFunctions({ region });
  const result = await stepFunctions
    .listExecutions({ stateMachineArn, statusFilter: 'RUNNING', maxResults: 1 })
    .promise();

  const { executions } = result;

  return executions;
};

export const getEventName = (event: AWS.StepFunctions.HistoryEvent) => {
  const { name } = event.stateEnteredEventDetails ||
    event.stateExitedEventDetails || {
      name: undefined,
    };
  return name;
};

export const getCurrentState = async (
  region: string,
  stateMachineArn: string,
) => {
  const executions = await getRunningExecutions(region, stateMachineArn);
  if (executions.length > 0) {
    const newestRunning = executions[0]; // the first is the newest one

    const stepFunctions = new AWS.StepFunctions({ region });
    const { executionArn } = newestRunning;
    const { events } = await stepFunctions
      .getExecutionHistory({ executionArn, reverseOrder: true, maxResults: 1 })
      .promise();
    if (events.length > 0) {
      const newestEvent = events[0];
      const name = getEventName(newestEvent);
      return name;
    } else {
      return undefined;
    }
  }
  return undefined;
};

export const getStates = async (region: string, stateMachineArn: string) => {
  const executions = await getRunningExecutions(region, stateMachineArn);
  if (executions.length > 0) {
    const newestRunning = executions[0]; // the first is the newest one

    const stepFunctions = new AWS.StepFunctions({ region });
    const { executionArn } = newestRunning;
    const { events } = await stepFunctions
      .getExecutionHistory({ executionArn, reverseOrder: true })
      .promise();
    const names = events
      .map(event => getEventName(event))
      .filter(name => !!name);
    return names;
  }
  return [];
};

export const stopRunningExecutions = async (
  region: string,
  stateMachineArn: string,
) => {
  const stepFunctions = new AWS.StepFunctions({ region });
  const executions = await getRunningExecutions(region, stateMachineArn);

  await Promise.all(
    executions.map(({ executionArn }) =>
      stepFunctions.stopExecution({ executionArn }).promise(),
    ),
  );
};
