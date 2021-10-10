import { EOL } from 'os';
import { verifyProps } from '../common';
import { expectedProps, ISqsProps } from '../common/sqs';
import { existsInQueue, IMessageMatcher } from '../utils/sqs';

export const toHaveMessage = async function (
  this: jest.MatcherUtils,
  props: ISqsProps,
  matcher: IMessageMatcher,
) {
  verifyProps({ ...props, matcher }, expectedProps);

  const { region, queueUrl } = props;

  try {
    const printQueueUrl = this.utils.printExpected(queueUrl);
    const printRegion = this.utils.printExpected(region);

    const notHint = this.utils.matcherHint('.not.toHaveMessage') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveMessage') + EOL + EOL;

    const found = await existsInQueue(region, queueUrl, matcher);
    // check if record was found
    if (found) {
      return {
        message: () =>
          `${notHint}Expected ${printQueueUrl} at region ${printRegion} not to have message`,
        pass: true,
      };
    } else {
      // no record was found
      return {
        message: () =>
          `${hint}Expected ${printQueueUrl} at region ${printRegion} to have message`,
        pass: false,
      };
    }
  } catch (error) {
    const e = error as Error;
    // unknown error
    console.error(`Unknown error while looking for message: ${e.message}`);
    throw e;
  }
};
