import { verifyProps } from '../common';
import { expectedProps, ISqsProps } from '../common/sqs';
import { existsInQueue, IMessageMatcher } from '../utils/sqs';
import { wrapWithRetries } from './utils';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      message: (matcher: IMessageMatcher) => Assertion;
    }
  }
}

const attemptSqs = async function (this: any, matcher: IMessageMatcher) {
  const props = this._obj as ISqsProps;
  verifyProps({ ...props, matcher }, expectedProps);

  const { region, queueUrl } = props;

  const found = await existsInQueue(region, queueUrl, matcher);
  return {
    message: `expected ${queueUrl} to have message`,
    negateMessage: `expected ${queueUrl} not to have message`,
    pass: found,
  };
};

const sqs = (chai: any) => {
  chai.Assertion.addMethod('message', async function (
    this: any,
    matcher: IMessageMatcher,
  ) {
    const wrapped = wrapWithRetries(attemptSqs);
    const { pass, message, negateMessage } = await wrapped.apply(this, [
      matcher,
    ]);

    this.assert(pass, message, negateMessage);
  });
};

export default sqs;
