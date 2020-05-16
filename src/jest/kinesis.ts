import { EOL } from 'os';
import { verifyProps } from '../common';
import { expectedProps, IKinesisProps } from '../common/kinesis';
import { existsInStream, IRecordMatcher } from '../utils/kinesis';

export const toHaveRecord = async function (
  this: jest.MatcherUtils,
  props: IKinesisProps,
  matcher: IRecordMatcher,
) {
  verifyProps({ ...props, matcher }, expectedProps);

  const { region, stream, timeout = 10 * 1000, pollEvery = 500 } = props;

  try {
    const printStream = this.utils.printExpected(stream);
    const printRegion = this.utils.printExpected(region);

    const notHint = this.utils.matcherHint('.not.toHaveRecord') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveRecord') + EOL + EOL;

    const found = await existsInStream(
      region,
      stream,
      matcher,
      timeout,
      pollEvery,
    );
    // check if record was found
    if (found) {
      return {
        message: () =>
          `${notHint}Expected ${printStream} at region ${printRegion} not to have record`,
        pass: true,
      };
    } else {
      // no record was found
      return {
        message: () =>
          `${hint}Expected ${printStream} at region ${printRegion} to have record`,
        pass: false,
      };
    }
  } catch (e) {
    // unknown error
    console.error(`Unknown error while looking for record: ${e.message}`);
    throw e;
  }
};
