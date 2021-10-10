import { diff } from 'jest-diff';
import { EOL } from 'os';
import { verifyProps } from '../common';
import { expectedProps, IApiProps, IExpectedResponse } from '../common/api';
import { getResponse } from '../utils/api';

export const toReturnResponse = async function (
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
  } catch (error) {
    const e = error as Error;
    // unknown error
    console.error(`Unknown error while getting response: ${e.message}`);
    throw e;
  }
};
