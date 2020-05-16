import { verifyProps } from '../common';
import { expectedProps, IApiProps, IExpectedResponse } from '../common/api';
import { getResponse } from '../utils/api';
import { wrapWithRetries } from './utils';

const attemptApi = async function (
  this: any,
  eql: any,
  objDisplay: any,
  expected: IExpectedResponse,
) {
  const props = this._obj as IApiProps;

  verifyProps(props, expectedProps);

  const { url, method, params, data, headers } = props;
  const received = await getResponse(url, method, params, data, headers);

  const deepEquals = eql(expected, received);
  return {
    message: `expected ${objDisplay(expected)} to be equal to ${objDisplay(
      received,
    )}`,
    negateMessage: `expected ${objDisplay(
      expected,
    )} to not be equal to ${objDisplay(received)}`,
    pass: deepEquals,
  };
};

const api = (chai: any, { eql, objDisplay }: any) => {
  chai.Assertion.addMethod('response', async function (
    this: any,
    expected: IExpectedResponse,
  ) {
    const wrapped = wrapWithRetries(attemptApi);
    const { pass, message, negateMessage } = await wrapped.apply(this, [
      eql,
      objDisplay,
      expected,
    ]);

    this.assert(pass, message, negateMessage);
  });
};

export default api;
