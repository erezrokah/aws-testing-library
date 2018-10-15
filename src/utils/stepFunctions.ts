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
      const { name } = newestEvent.stateEnteredEventDetails ||
        newestEvent.stateExitedEventDetails || {
          name: undefined,
        };
      return name;
    } else {
      return undefined;
    }
  }
  return undefined;
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
