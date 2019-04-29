import { verifyProps } from '../common';
import { expectedProps, IApiProps, IExpectedResponse } from '../common/api';
import { getResponse } from '../utils/api';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      response: (expected: IExpectedResponse) => Assertion;
    }
  }
}

const api = (chai: any, { eql, objDisplay }: any) => {
  chai.Assertion.addMethod('response', async function(
    this: any,
    expected: IExpectedResponse,
  ) {
    const props = this._obj as IApiProps;

    verifyProps(props, expectedProps);

    const { url, method, params, data, headers } = props;
    const received = await getResponse(url, method, params, data, headers);

    const deepEquals = eql(expected, received);

    this.assert(
      deepEquals,
      `expected ${objDisplay(expected)} to be equal to ${objDisplay(received)}`,
      `expected ${objDisplay(expected)} to not be equal to ${objDisplay(
        received,
      )}`,
    );
  });
};

export default api;
