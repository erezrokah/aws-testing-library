import AWS = require('aws-sdk');

export const invoke = async (
  region: string,
  functionName: string,
  payload?: any,
) => {
  const lambda = new AWS.Lambda({ region });

  const lambdaPayload = payload ? { Payload: JSON.stringify(payload) } : {};
  const params = {
    FunctionName: functionName,
    ...lambdaPayload,
  };

  const { Payload } = await lambda.invoke(params).promise();
  if (Payload) {
    return JSON.parse(Payload.toString());
  } else {
    return undefined;
  }
};
