import { verifyProps } from '../common';
import { expectedProps, IS3Props } from '../common/s3';
import { getObject } from '../utils/s3';
import { wrapWithRetries } from './utils';

const attemptS3 = async function(
  this: any,
  eql: any,
  objDisplay: any,
  key: string,
  expected: Buffer,
) {
  const props = this._obj as IS3Props;
  verifyProps({ ...props, key }, expectedProps);

  const { region, bucket } = props;
  const { body: received, found } = await getObject(region, bucket, key);

  if (found && expected) {
    // check equality as well
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
  } else {
    // only check existence
    return {
      message: `expected ${bucket} to have object with key ${key}`,
      negateMessage: `expected ${bucket} not to have object with key ${key}`,
      pass: found,
    };
  }
};

const s3 = (chai: any, { eql, objDisplay }: any) => {
  chai.Assertion.addMethod('object', async function(
    this: any,
    key: string,
    expected?: Buffer,
  ) {
    const wrapped = wrapWithRetries(attemptS3);
    const { pass, message, negateMessage } = await wrapped.apply(this, [
      eql,
      objDisplay,
      key,
      expected,
    ]);

    this.assert(pass, message, negateMessage);
  });
};

export default s3;
