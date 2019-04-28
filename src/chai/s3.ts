import { verifyProps } from '../common';
import { expectedProps, IS3Props } from '../common/s3';
import { getObject } from '../utils/s3';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      object: (key: string) => Assertion;
    }
  }
}

const s3 = (chai: any) => {
  chai.Assertion.addMethod('object', async function(this: any, key: string) {
    const props = this._obj as IS3Props;
    verifyProps({ ...props, key }, expectedProps);

    const { region, bucket } = props;
    const { found } = await getObject(region, bucket, key);

    this.assert(
      found,
      `expected ${bucket} to have object with key ${key}`,
      `expected ${bucket} not to have object with key ${key}`,
    );
  });
};

export default s3;
