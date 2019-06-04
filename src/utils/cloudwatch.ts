import AWS = require('aws-sdk');

const getLogGroupName = (functionName: string) => `/aws/lambda/${functionName}`;

const hoursToMilliseconds = (hours: number) => hours * 60 * 60 * 1000;

export const filterLogEvents = async (
  region: string,
  functionName: string,
  pattern: string,
) => {
  const cloudWatchLogs = new AWS.CloudWatchLogs({ region });
  const logGroupName = getLogGroupName(functionName);
  const filterPattern = `"${pattern}"`; // enclose with "" to support special characters
  const startTime = Date.now() - hoursToMilliseconds(1);

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

  const logStreamNames = logStreams.map(s => s.logStreamName || '');

  await Promise.all(
    logStreamNames.map(logStreamName => {
      return cloudWatchLogs
        .deleteLogStream({ logGroupName, logStreamName })
        .promise();
    }),
  );
};
