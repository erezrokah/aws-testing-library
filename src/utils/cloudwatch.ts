import AWS = require('aws-sdk');

const getLogGroupName = (functionName: string) => `/aws/lambda/${functionName}`;

export const filterLogEvents = async (
  region: string,
  functionName: string,
  pattern: string,
) => {
  const cloudwatchlogs = new AWS.CloudWatchLogs({ region });
  const logGroupName = getLogGroupName(functionName);
  const filterPattern = `"${pattern}"`; // enclose with "" to support special characters

  const { events = [] } = await cloudwatchlogs
    .filterLogEvents({
      filterPattern,
      interleaved: true,
      limit: 1,
      logGroupName,
    })
    .promise();

  return { events };
};

const getLogStreams = async (region: string, functionName: string) => {
  const cloudwatchlogs = new AWS.CloudWatchLogs({ region });
  const logGroupName = getLogGroupName(functionName);

  const { logStreams = [] } = await cloudwatchlogs
    .describeLogStreams({
      descending: true,
      logGroupName,
      orderBy: 'LastEventTime',
    })
    .promise();

  return { logStreams };
};

export const deleteAllLogs = async (region: string, functionName: string) => {
  const { logStreams } = await getLogStreams(region, functionName);
  if (logStreams.length <= 0) {
    return;
  }
  const cloudwatchlogs = new AWS.CloudWatchLogs({ region });
  const logGroupName = getLogGroupName(functionName);

  const logStreamNames = logStreams.map(s => s.logStreamName || '');

  await Promise.all(
    logStreamNames.map(logStreamName => {
      return cloudwatchlogs
        .deleteLogStream({ logGroupName, logStreamName })
        .promise();
    }),
  );
};
