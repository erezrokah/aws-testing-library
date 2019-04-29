import { verifyProps } from '../common';
import { expectedProps, IS3Props } from '../common/s3';
import { getObject } from '../utils/s3';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      object: (key: string, expected?: Buffer) => Assertion;
    }
  }
}

const s3 = (chai: any, { eql, objDisplay }: any) => {
  chai.Assertion.addMethod('object', async function(
    this: any,
    key: string,
    expected?: Buffer,
  ) {
    const props = this._obj as IS3Props;
    verifyProps({ ...props, key }, expectedProps);

    const { region, bucket } = props;
    const { body: received, found } = await getObject(region, bucket, key);

    if (found && expected) {
      // check equality as well
      const deepEquals = eql(expected, received);
      this.assert(
        deepEquals,
        `expected ${objDisplay(expected)} to be equal to ${objDisplay(
          received,
        )}`,
        `expected ${objDisplay(expected)} to not be equal to ${objDisplay(
          received,
        )}`,
      );
    } else {
      // only check existence
      this.assert(
        found,
        `expected ${bucket} to have object with key ${key}`,
        `expected ${bucket} not to have object with key ${key}`,
      );
    }
  });
};

export default s3;
