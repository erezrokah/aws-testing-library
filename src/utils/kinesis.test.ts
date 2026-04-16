import MockDate = require('mockdate');
import { existsInStream } from './kinesis';

jest.mock('aws-sdk', () => {
  const getRecordsValue = { promise: jest.fn() };
  const getRecords = jest.fn(() => getRecordsValue);

  const getShardIteratorValue = { promise: jest.fn() };
  const getShardIterator = jest.fn(() => getShardIteratorValue);

  const describeStreamValue = { promise: jest.fn() };
  const describeStream = jest.fn(() => describeStreamValue);

  const Kinesis = jest.fn(() => ({
    describeStream,
    getRecords,
    getShardIterator,
  }));
  return { Kinesis };
});

describe('kinesis utils', () => {
  const AWS = require('aws-sdk');
  const kinesis = AWS.Kinesis;

  const [region, stream, matcher, timeout] = [
    'region',
    'stream',
    jest.fn(),
    5000,
  ];

  afterEach(() => {
    MockDate.reset();
  });

  test('existsInStream item found', async () => {
    MockDate.set('1948/1/1');

    const getRecords = kinesis().getRecords;
    const getRecordsPromise = getRecords().promise;

    const record1 = { id: 'data1' };
    const records = [{ Data: JSON.stringify(record1) }];
    getRecordsPromise.mockReturnValue({
      NextShardIterator: null,
      Records: records,
    });

    const getShardIterator = kinesis().getShardIterator;
    const getShardIteratorPromise = getShardIterator().promise;

    const shardIterators = [
      {
        ShardIterator: 'iterator0001',
      },
    ];
    shardIterators.forEach((s) =>
      getShardIteratorPromise.mockReturnValueOnce(s),
    );

    const describeStream = kinesis().describeStream;
    const describeStreamPromise = describeStream().promise;

    const streamDescription = {
      StreamDescription: {
        Shards: [{ ShardId: '0001' }],
      },
    };
    describeStreamPromise.mockReturnValue(Promise.resolve(streamDescription));

    matcher.mockReturnValue(true);

    jest.clearAllMocks();

    const exists = await existsInStream(region, stream, matcher, timeout);

    expect(exists).toBe(true);

    expect(describeStream).toHaveBeenCalledTimes(1);
    expect(describeStreamPromise).toHaveBeenCalledTimes(1);

    expect(describeStream).toHaveBeenCalledWith({ StreamName: stream });

    expect(getShardIterator).toHaveBeenCalledTimes(1);
    expect(getShardIteratorPromise).toHaveBeenCalledTimes(1);

    expect(getShardIterator).toHaveBeenCalledWith({
      ShardId: streamDescription.StreamDescription.Shards[0].ShardId,
      ShardIteratorType: 'AT_TIMESTAMP',
      StreamName: stream,
      Timestamp: new Date(Date.now() - 1000 * 60 * 5),
    });

    expect(getRecords).toHaveBeenCalledTimes(1);
    expect(getRecordsPromise).toHaveBeenCalledTimes(1);

    expect(getRecords).toHaveBeenCalledWith({
      ShardIterator: shardIterators[0].ShardIterator,
    });

    expect(matcher).toHaveBeenCalledTimes(1);
    expect(matcher).toHaveBeenCalledWith(record1, 0, [record1]);
  });

  test('existsInStream item not found due to null NextShardIterator', async () => {
    const getRecords = kinesis().getRecords;
    const getRecordsPromise = getRecords().promise;

    const record1 = { id: 'data1' };
    const records = [{ Data: JSON.stringify(record1) }];
    getRecordsPromise.mockReturnValue({
      NextShardIterator: null,
      Records: records,
    });

    const getShardIterator = kinesis().getShardIterator;
    const getShardIteratorPromise = getShardIterator().promise;

    const shardIterators = [
      {
        ShardIterator: 'iterator0001',
      },
    ];
    shardIterators.forEach((s) =>
      getShardIteratorPromise.mockReturnValueOnce(s),
    );

    const describeStream = kinesis().describeStream;
    const describeStreamPromise = describeStream().promise;

    const streamDescription = {
      StreamDescription: {
        Shards: [{ ShardId: '0001' }],
      },
    };
    describeStreamPromise.mockReturnValue(Promise.resolve(streamDescription));

    matcher.mockReturnValue(false);

    jest.clearAllMocks();

    const exists = await existsInStream(region, stream, matcher, timeout);

    expect(exists).toBe(false);
    expect(getRecords).toHaveBeenCalledTimes(1);
    expect(matcher).toHaveBeenCalledTimes(1);
  });

  test('existsInStream item not found due to null ShardIterator', async () => {
    const getRecords = kinesis().getRecords;
    const getShardIterator = kinesis().getShardIterator;
    const getShardIteratorPromise = getShardIterator().promise;

    const shardIterators = [
      {
        ShardIterator: null,
      },
    ];
    shardIterators.forEach((s) =>
      getShardIteratorPromise.mockReturnValueOnce(s),
    );

    const describeStream = kinesis().describeStream;
    const describeStreamPromise = describeStream().promise;

    const streamDescription = {
      StreamDescription: {
        Shards: [{ ShardId: '0001' }],
      },
    };
    describeStreamPromise.mockReturnValue(Promise.resolve(streamDescription));

    jest.clearAllMocks();

    const exists = await existsInStream(region, stream, matcher, timeout);

    expect(exists).toBe(false);
    expect(getRecords).toHaveBeenCalledTimes(0);
    expect(matcher).toHaveBeenCalledTimes(0);
  });

  test('existsInStream item not found due to timeout', async () => {
    const getRecords = kinesis().getRecords;
    const getRecordsPromise = getRecords().promise;

    const record1 = { id: 'data1' };
    const records = [{ Data: JSON.stringify(record1) }];
    getRecordsPromise.mockReturnValue({
      NextShardIterator: 'iterator0002',
      Records: records,
    });

    const getShardIterator = kinesis().getShardIterator;
    const getShardIteratorPromise = getShardIterator().promise;

    const shardIterators = [
      {
        ShardIterator: 'iterator0001',
      },
    ];
    shardIterators.forEach((s) =>
      getShardIteratorPromise.mockReturnValueOnce(s),
    );

    const describeStream = kinesis().describeStream;
    const describeStreamPromise = describeStream().promise;

    const streamDescription = {
      StreamDescription: {
        Shards: [{ ShardId: '0001' }],
      },
    };
    describeStreamPromise.mockReturnValue(Promise.resolve(streamDescription));

    matcher.mockReturnValue(false);

    jest.clearAllMocks();

    const exists = await existsInStream(region, stream, matcher, 50, 10);

    expect(exists).toBe(false);
    expect(getRecords.mock.calls.length).toBeGreaterThan(1);
    expect(matcher.mock.calls.length).toBeGreaterThan(1);
  });
});
