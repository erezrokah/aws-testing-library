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

const api = (chai: any) => {
  chai.Assertion.addMethod('response', async function(
    this: any,
    expected: IExpectedResponse,
  ) {
    const props = this._obj as IApiProps;

    verifyProps(props, expectedProps);

    const { url, method, params, data, headers } = props;
    const received = await getResponse(url, method, params, data, headers);

    const { negate } = this.__flags;
    if (negate) {
      new chai.Assertion(expected).to.not.deep.equal(received);
    } else {
      new chai.Assertion(expected).to.deep.equal(received);
    }
  });
};

export default api;
