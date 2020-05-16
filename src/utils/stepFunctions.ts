import AWS = require('aws-sdk');

const getExecutions = async (
  region: string,
  stateMachineArn: string,
  statusFilter?: string,
) => {
  const stepFunctions = new AWS.StepFunctions({ region });
  const opts = {
    maxResults: 1,
    stateMachineArn,
    ...(statusFilter && { statusFilter }),
  };
  const result = await stepFunctions.listExecutions(opts).promise();

  const { executions } = result;

  return executions;
};

const RUNNING = 'RUNNING';

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
  const executions = await getExecutions(region, stateMachineArn, RUNNING);
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
  const executions = await getExecutions(region, stateMachineArn);
  if (executions.length > 0) {
    const newestRunning = executions[0]; // the first is the newest one

    const stepFunctions = new AWS.StepFunctions({ region });
    const { executionArn } = newestRunning;
    const { events } = await stepFunctions
      .getExecutionHistory({ executionArn, reverseOrder: true })
      .promise();
    const names = events
      .map((event) => getEventName(event))
      .filter((name) => !!name);
    return names;
  }
  return [];
};

export const stopRunningExecutions = async (
  region: string,
  stateMachineArn: string,
) => {
  const stepFunctions = new AWS.StepFunctions({ region });
  const executions = await getExecutions(region, stateMachineArn, RUNNING);

  await Promise.all(
    executions.map(({ executionArn }) =>
      stepFunctions.stopExecution({ executionArn }).promise(),
    ),
  );
};
