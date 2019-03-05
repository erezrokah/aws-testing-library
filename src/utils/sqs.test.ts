import { existsInQueue, subscribeToTopic, unsubscribeFromTopic } from './sqs';

jest.mock('aws-sdk', () => {
  const subscribeValue = { promise: jest.fn() };
  const subscribe = jest.fn(() => subscribeValue);

  const unsubscribeValue = { promise: jest.fn() };
  const unsubscribe = jest.fn(() => unsubscribeValue);

  const SNS = jest.fn(() => ({ subscribe, unsubscribe }));

  const setQueueAttributesValue = { promise: jest.fn() };
  const setQueueAttributes = jest.fn(() => setQueueAttributesValue);

  const deleteQueueValue = { promise: jest.fn() };
  const deleteQueue = jest.fn(() => deleteQueueValue);

  const getQueueAttributesValue = { promise: jest.fn() };
  const getQueueAttributes = jest.fn(() => getQueueAttributesValue);

  const createQueueValue = { promise: jest.fn() };
  const createQueue = jest.fn(() => createQueueValue);

  const receiveMessageValue = { promise: jest.fn() };
  const receiveMessage = jest.fn(() => receiveMessageValue);

  const SQS = jest.fn(() => ({
    createQueue,
    deleteQueue,
    getQueueAttributes,
    receiveMessage,
    setQueueAttributes,
  }));
  return { SQS, SNS };
});

jest.mock('uuid', () => {
  const v1 = jest.fn(() => '00000000');
  return { v1 };
});

describe('kinesis utils', () => {
  const AWS = require('aws-sdk');
  const sqs = AWS.SQS;
  const sns = AWS.SNS;

  const region = 'region';

  test('should return { subscriptionArn, queueUrl } on subscribeToTopic', async () => {
    const createQueue = sqs().createQueue;
    const createQueuePromise = createQueue().promise;

    const QueueUrl = 'QueueUrl';
    createQueuePromise.mockReturnValue({
      QueueUrl,
    });

    const getQueueAttributes = sqs().getQueueAttributes;
    const getQueueAttributesPromise = getQueueAttributes().promise;

    const setQueueAttributes = sqs().setQueueAttributes;

    const QueueArn = 'QueueArn';
    getQueueAttributesPromise.mockReturnValue({
      Attributes: { QueueArn },
    });

    const subscribe = sns().subscribe;
    const subscribePromise = subscribe().promise;

    const SubscriptionArn = 'SubscriptionArn';
    subscribePromise.mockReturnValue({
      SubscriptionArn,
    });

    jest.clearAllMocks();

    const topicArn = 'topicArn';

    const result = await subscribeToTopic(region, topicArn);

    expect.assertions(9);

    expect(createQueue).toHaveBeenCalledTimes(1);
    expect(createQueue).toHaveBeenCalledWith({
      Attributes: { VisibilityTimeout: '0' },
      QueueName: 'TestNotificationTopicQueue-00000000',
    });

    expect(getQueueAttributes).toHaveBeenCalledTimes(1);
    expect(getQueueAttributes).toHaveBeenCalledWith({
      AttributeNames: ['QueueArn'],
      QueueUrl,
    });

    const policy = {
      Statement: [
        {
          Action: 'sqs:SendMessage',
          Condition: {
            ArnEquals: {
              'aws:SourceArn': topicArn,
            },
          },
          Effect: 'Allow',
          Principal: {
            AWS: '*',
          },
          Resource: QueueArn,
          Sid: 'TestNotificationTopicQueuePolicy',
        },
      ],
    };

    expect(setQueueAttributes).toHaveBeenCalledTimes(1);
    expect(setQueueAttributes).toHaveBeenCalledWith({
      Attributes: { Policy: JSON.stringify(policy) },
      QueueUrl,
    });

    expect(subscribe).toHaveBeenCalledTimes(1);
    expect(subscribe).toHaveBeenCalledWith({
      Endpoint: QueueArn,
      Protocol: 'sqs',
      TopicArn: topicArn,
    });

    expect(result).toEqual({
      queueUrl: QueueUrl,
      subscriptionArn: SubscriptionArn,
    });
  });

  test('should unsubscribe from topic and delete queue on unsubscribeFromTopic', async () => {
    const unsubscribe = sns().unsubscribe;
    const unsubscribePromise = unsubscribe().promise;

    const deleteQueue = sqs().deleteQueue;
    const deleteQueuePromise = deleteQueue().promise;

    jest.clearAllMocks();

    const subscriptionArn = 'subscriptionArn';
    const queueUrl = 'queueUrl';

    await unsubscribeFromTopic(region, subscriptionArn, queueUrl);

    expect.assertions(6);

    expect(unsubscribe).toHaveBeenCalledTimes(1);
    expect(unsubscribePromise).toHaveBeenCalledTimes(1);
    expect(unsubscribe).toHaveBeenCalledWith({
      SubscriptionArn: subscriptionArn,
    });

    expect(deleteQueue).toHaveBeenCalledTimes(1);
    expect(deleteQueuePromise).toHaveBeenCalledTimes(1);
    expect(deleteQueue).toHaveBeenCalledWith({ QueueUrl: queueUrl });
  });

  test('should return true on existsInQueue when message is found', async () => {
    const queueUrl = 'queueUrl';
    const matcher = jest.fn(() => true);

    const receiveMessage = sqs().receiveMessage;
    const receiveMessageValue = receiveMessage().promise;
    const Messages = [
      { Body: JSON.stringify({ Subject: 'Subject', Message: 'Message' }) },
    ];
    receiveMessageValue.mockReturnValue({
      Messages,
    });

    jest.clearAllMocks();

    const result = await existsInQueue(region, queueUrl, matcher);

    expect.assertions(5);

    expect(receiveMessage).toHaveBeenCalledTimes(1);
    expect(receiveMessage).toHaveBeenCalledWith({
      QueueUrl: queueUrl,
      WaitTimeSeconds: 20,
    });

    expect(matcher).toHaveBeenCalledTimes(Messages.length);
    expect(matcher).toHaveBeenCalledWith(JSON.parse(Messages[0].Body), 0, [
      JSON.parse(Messages[0].Body),
    ]);

    expect(result).toBe(true);
  });

  test('should return false on existsInQueue when no messages', async () => {
    const queueUrl = 'queueUrl';
    const matcher = jest.fn(() => true);

    const receiveMessage = sqs().receiveMessage;
    const receiveMessageValue = receiveMessage().promise;
    receiveMessageValue.mockReturnValue({});

    jest.clearAllMocks();

    const result = await existsInQueue(region, queueUrl, matcher);

    expect.assertions(4);

    expect(receiveMessage).toHaveBeenCalledTimes(1);
    expect(receiveMessage).toHaveBeenCalledWith({
      QueueUrl: queueUrl,
      WaitTimeSeconds: 20,
    });

    expect(matcher).toHaveBeenCalledTimes(0);
    expect(result).toBe(false);
  });
});
