import { Kinesis } from 'aws-sdk';

export type IRecordMatcher = (args: any) => boolean;

const getRecords = async (kinesis: Kinesis, shardIterator: string) => {
  const {
    NextShardIterator: nextShardIterator,
    Records: records,
  } = await kinesis.getRecords({ ShardIterator: shardIterator }).promise();

  const data = records.map(r => JSON.parse(r.Data.toString()));

  return { nextShardIterator, data };
};

const sleep = async (time: number) => {
  return await new Promise(resolve => setTimeout(resolve, time));
};

export const existsInShard = async (
  kinesis: Kinesis,
  shardIterator: string | undefined,
  matcher: IRecordMatcher,
  timeout: number,
  pollEvery: number,
) => {
  if (!shardIterator) {
    return false;
  }

  let found = false;
  let timeoutReached = false;
  const start = new Date().getTime();

  let nextShardIterator = shardIterator;
  do {
    const records = await getRecords(kinesis, nextShardIterator);
    const data = records.data;

    const index = data.findIndex(matcher);
    if (index >= 0) {
      found = true;
      break;
    }

    const currentTime = new Date().getTime();
    timeoutReached = currentTime - start >= timeout;
    if (timeoutReached) {
      break;
    }

    nextShardIterator = records.nextShardIterator || '';

    if (nextShardIterator) {
      // throttle the consumer
      await sleep(pollEvery);
    }
  } while (nextShardIterator);

  return found;
};

export const existsInStream = async (
  region: string,
  stream: string,
  matcher: IRecordMatcher,
  timeout: number,
  pollEvery = 500,
) => {
  const kinesis = new Kinesis({ region });
  const streamDescription = await kinesis
    .describeStream({ StreamName: stream })
    .promise();

  const shardIterators = await Promise.all(
    // search in all shards
    streamDescription.StreamDescription.Shards.map(s => {
      return kinesis
        .getShardIterator({
          ShardId: s.ShardId,
          ShardIteratorType: 'AT_TIMESTAMP',
          StreamName: stream,
          Timestamp: new Date(Date.now() - 1000 * 60 * 5), // start searching from 5 minutes ago
        })
        .promise();
    }),
  );

  const results = await Promise.all(
    shardIterators.map(s =>
      existsInShard(kinesis, s.ShardIterator, matcher, timeout, pollEvery),
    ),
  );
  const exists = results.some(r => r);
  return exists;
};
