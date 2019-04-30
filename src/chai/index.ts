import { IExpectedResponse } from '../common/api';
import { IRecordMatcher } from '../utils/kinesis';
import { IMessageMatcher } from '../utils/sqs';

import api from './api';
import cloudwatch from './cloudwatch';
import dynamoDb from './dynamoDb';
import kinesis from './kinesis';
import s3 from './s3';
import sqs from './sqs';
import stepFunctions from './stepFunctions';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      response: (expected: IExpectedResponse) => Assertion;
      log: (pattern: string) => Assertion;
      item: (
        key: AWS.DynamoDB.DocumentClient.Key,
        expectedItem?: AWS.DynamoDB.DocumentClient.AttributeMap,
        strict?: boolean,
      ) => Assertion;
      record: (matcher: IRecordMatcher) => Assertion;
      object: (key: string, expected?: Buffer) => Assertion;
      message: (matcher: IMessageMatcher) => Assertion;
      atState: (state: string) => Assertion;
      state: (state: string) => Assertion;
    }
  }
}

const awsTesting = function(this: any, chai: any, utils: any) {
  api(chai, utils);
  cloudwatch(chai);
  dynamoDb(chai, utils);
  kinesis(chai);
  s3(chai, utils);
  sqs(chai);
  stepFunctions(chai);
};

export default awsTesting;
