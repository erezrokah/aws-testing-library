import AWS = require('aws-sdk');

export const getLogGroupName = (functionName: string) =>
  `/aws/lambda/${functionName}`;

export const filterLogEvents = async (
  region: string,
  logGroupName: string,
  startTime: number,
  filterPattern: string,
) => {
  const cloudWatchLogs = new AWS.CloudWatchLogs({ region });

  const { events = [] } = await cloudWatchLogs
    .filterLogEvents({
      filterPattern,
      interleaved: true,
      limit: 1,
      logGroupName,
      startTime,
    })
    .promise();

  return { events };
};

const getLogStreams = async (region: string, functionName: string) => {
  const cloudWatchLogs = new AWS.CloudWatchLogs({ region });
  const logGroupName = getLogGroupName(functionName);

  const { logStreams = [] } = await cloudWatchLogs
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
  const cloudWatchLogs = new AWS.CloudWatchLogs({ region });
  const logGroupName = getLogGroupName(functionName);

  const logStreamNames = logStreams.map((s) => s.logStreamName || '');

  await Promise.all(
    logStreamNames.map((logStreamName) => {
      return cloudWatchLogs
        .deleteLogStream({ logGroupName, logStreamName })
        .promise();
    }),
  );
};
