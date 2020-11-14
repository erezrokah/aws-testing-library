/* eslint-disable @typescript-eslint/no-var-requires */
import { invoke } from './lambda';

jest.mock('aws-sdk', () => {
  const promise = jest.fn();
  const invokeValue = { promise };
  const lambdaInvoke = jest.fn(() => invokeValue);
  const Lambda = jest.fn(() => ({ invoke: lambdaInvoke }));
  return { Lambda };
});

describe('lambda utils', () => {
  const AWS = require('aws-sdk');
  const lambda = AWS.Lambda;

  const [region, functionName] = ['region', 'functionName'];

  describe('invoke', () => {
    test('invoke should return parsed payload', async () => {
      const lambdaInvoke = lambda().invoke;
      const promise = lambdaInvoke().promise;

      const payload = {
        body: 'some return value',
        headers: { someHeader: 'someHeader' },
      };
      const expected = {
        Payload: JSON.stringify(payload),
      };
      promise.mockReturnValue(Promise.resolve(expected));

      jest.clearAllMocks();

      const actual = await invoke(region, functionName, payload);

      expect(actual).toEqual(payload);
      expect(lambda).toHaveBeenCalledTimes(1);
      expect(lambda).toHaveBeenCalledWith({ region });
      expect(lambdaInvoke).toHaveBeenCalledTimes(1);
      expect(lambdaInvoke).toHaveBeenCalledWith({
        FunctionName: functionName,
        Payload: JSON.stringify(payload),
      });
    });

    test('invoke should return undefined', async () => {
      const lambdaInvoke = lambda().invoke;
      const promise = lambdaInvoke().promise;

      promise.mockReturnValue(Promise.resolve({}));

      jest.clearAllMocks();

      const actual = await invoke(region, functionName);

      expect(actual).toBeUndefined();
      expect(lambda).toHaveBeenCalledTimes(1);
      expect(lambda).toHaveBeenCalledWith({ region });
      expect(lambdaInvoke).toHaveBeenCalledTimes(1);
      expect(lambdaInvoke).toHaveBeenCalledWith({
        FunctionName: functionName,
      });
    });
  });
});
