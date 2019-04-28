import { verifyProps } from '../common';
import { expectedProps, ISqsProps } from '../common/sqs';
import { existsInQueue, IMessageMatcher } from '../utils/sqs';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      message: (matcher: IMessageMatcher) => Assertion;
    }
  }
}

const sqs = (chai: any) => {
  chai.Assertion.addMethod('message', async function(
    this: any,
    matcher: IMessageMatcher,
  ) {
    const props = this._obj as ISqsProps;
    verifyProps({ ...props, matcher }, expectedProps);

    const { region, queueUrl } = props;

    const found = await existsInQueue(region, queueUrl, matcher);

    this.assert(
      found,
      `expected ${queueUrl} to have message`,
      `expected ${queueUrl} not to have message`,
    );
  });
};

export default sqs;
