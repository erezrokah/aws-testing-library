jest.mock('./api');
jest.mock('./cloudwatch');
jest.mock('./dynamoDb');
jest.mock('./kinesis');
jest.mock('./s3');
jest.mock('./sqs');
jest.mock('./stepFunctions');

describe('index', () => {
  test('calls all modules functions', () => {
    const awsTesting = require('./').default;
    const [api, cloudwatch, dynamoDb, kinesis, s3, sqs, stepFunctions] = [
      require('./api').default,
      require('./cloudwatch').default,
      require('./dynamoDb').default,
      require('./kinesis').default,
      require('./s3').default,
      require('./sqs').default,
      require('./stepFunctions').default,
    ];

    const chai = jest.fn();
    const utils = jest.fn();

    awsTesting(chai, utils);

    expect(api).toHaveBeenCalledTimes(1);
    expect(api).toHaveBeenCalledWith(chai, utils);

    expect(cloudwatch).toHaveBeenCalledTimes(1);
    expect(cloudwatch).toHaveBeenCalledWith(chai);

    expect(dynamoDb).toHaveBeenCalledTimes(1);
    expect(dynamoDb).toHaveBeenCalledWith(chai, utils);

    expect(kinesis).toHaveBeenCalledTimes(1);
    expect(kinesis).toHaveBeenCalledWith(chai);

    expect(s3).toHaveBeenCalledTimes(1);
    expect(s3).toHaveBeenCalledWith(chai, utils);

    expect(sqs).toHaveBeenCalledTimes(1);
    expect(sqs).toHaveBeenCalledWith(chai);

    expect(stepFunctions).toHaveBeenCalledTimes(1);
    expect(stepFunctions).toHaveBeenCalledWith(chai);
  });
});
