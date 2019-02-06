import diff = require('jest-diff');
import { EOL } from 'os';
import { getResponse, IPlainObject } from '../utils/api';
import { verifyProps } from './common';

interface IApiProps {
  method: string;
  url: string;
  params?: IPlainObject;
  data?: IPlainObject;
  headers?: IPlainObject;
}

export interface IExpectedResponse {
  statusCode: number;
  data: IPlainObject;
}

const expectedProps = ['url', 'method'];

export const toReturnResponse = async function(
  this: jest.MatcherUtils,
  props: IApiProps,
  expected: IExpectedResponse,
) {
  verifyProps({ ...props }, expectedProps);

  const { url, method, params, data, headers } = props;

  try {
    const printMethod = this.utils.printExpected(method);
    const printUrl = this.utils.printExpected(url);

    const notHint = this.utils.matcherHint('.not.toReturnResponse') + EOL + EOL;
    const hint = this.utils.matcherHint('.toReturnResponse') + EOL + EOL;

    const received = await getResponse(url, method, params, data, headers);

    const pass = this.equals(expected, received);

    const printReceived = this.utils.printReceived(received);
    const printExpected = this.utils.printExpected(expected);

    if (pass) {
      return {
        message: () =>
          `${notHint}Expected response ${printReceived} not to equal ${printExpected}.${EOL}` +
          `Request data: ${printMethod}: ${printUrl}`,
        pass: true,
      };
    } else {
      const diffString = diff(expected, received, {
        expand: true,
      });
      return {
        message: () =>
          `${hint}Expected response ${printReceived} to equal ${printExpected}${EOL}` +
          `Difference:${diffString ? `${EOL}${EOL}${diffString}` : ''}${EOL}` +
          `Request data: ${printMethod}: ${printUrl}`,
        pass: false,
      };
    }
  } catch (e) {
    // unknown error
    console.error(`Unknown error while getting response: ${e.message}`);
    throw e;
  }
};
