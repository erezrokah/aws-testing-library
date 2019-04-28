import api from './api';
import cloudwatch from './cloudwatch';
import dynamoDb from './dynamoDb';
import kinesis from './kinesis';
import s3 from './s3';
import sqs from './sqs';
import stepFunctions from './stepFunctions';

const chaiServerless = function(this: any, chai: any) {
  api(chai);
  cloudwatch(chai);
  dynamoDb(chai);
  kinesis(chai);
  s3(chai);
  sqs(chai);
  stepFunctions(chai);
};

export default chaiServerless;
