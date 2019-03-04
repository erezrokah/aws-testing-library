import AWS = require('aws-sdk');
import { v1 as uuid } from 'uuid';

export type IMessageMatcher = (args: any) => boolean;

export const subscribeToTopic = async (region: string, topicArn: string) => {
  const sqs = new AWS.SQS({ region });
  const queueName = `TestNotificationTopicQueue-${uuid()}`;
  const { QueueUrl } = (await sqs
    .createQueue({
      Attributes: { VisibilityTimeout: '0' },
      QueueName: queueName,
    })
    .promise()) as { QueueUrl: string };

  const { Attributes } = (await sqs
    .getQueueAttributes({
      AttributeNames: ['QueueArn'],
      QueueUrl,
    })
    .promise()) as { Attributes: AWS.SQS.QueueAttributeMap };

  const { QueueArn } = Attributes;

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

  await sqs
    .setQueueAttributes({
      Attributes: { Policy: JSON.stringify(policy) },
      QueueUrl,
    })
    .promise();

  const sns = new AWS.SNS({ region });
  const { SubscriptionArn } = await sns
    .subscribe({ TopicArn: topicArn, Protocol: 'sqs', Endpoint: QueueArn })
    .promise();

  return { subscriptionArn: SubscriptionArn as string, queueUrl: QueueUrl };
};

export const unsubscribeFromTopic = async (
  region: string,
  subscriptionArn: string,
  queueUrl: string,
) => {
  const sqs = new AWS.SQS({ region });
  const sns = new AWS.SNS({ region });

  await sns.unsubscribe({ SubscriptionArn: subscriptionArn }).promise();
  await sqs.deleteQueue({ QueueUrl: queueUrl }).promise();
};

export const existsInQueue = async (
  region: string,
  queueUrl: string,
  matcher: IMessageMatcher,
) => {
  const sqs = new AWS.SQS({ region });
  const { Messages } = (await sqs
    .receiveMessage({ QueueUrl: queueUrl, WaitTimeSeconds: 20 })
    .promise()) as { Messages: AWS.SQS.Message[] };

  const messages = Messages.map(item => JSON.parse(item.Body as string));

  const exists = messages.some(matcher);
  return exists;
};
