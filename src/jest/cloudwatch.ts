import { EOL } from 'os';
import { expectedProps, ICloudwatchProps } from '../common/cloudwatch';
import { epochDateMinusHours, verifyProps } from '../common/index';
import { filterLogEvents } from '../utils/cloudwatch';

export const toHaveLog = async function (
  this: jest.MatcherUtils,
  props: ICloudwatchProps,
  pattern: string,
) {
  verifyProps({ ...props, pattern }, expectedProps);
  const {
    region,
    function: functionName,
    startTime = epochDateMinusHours(1),
  } = props;

  try {
    const printFunctionName = this.utils.printExpected(functionName);
    const printRegion = this.utils.printExpected(region);
    const printPattern = this.utils.printExpected(pattern) + EOL;

    const notHint = this.utils.matcherHint('.not.toHaveLog') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveLog') + EOL + EOL;

    const { events } = await filterLogEvents(
      region,
      functionName,
      startTime,
      pattern,
    );
    const found = events.length > 0;
    if (found) {
      // matching log found
      return {
        message: () =>
          `${notHint}Expected ${printFunctionName} at region ${printRegion} not to have log matching pattern ${printPattern}`,
        pass: true,
      };
    } else {
      // matching log not found
      return {
        message: () =>
          `${hint}Expected ${printFunctionName} at region ${printRegion} to have log matching pattern ${printPattern}`,
        pass: false,
      };
    }
  } catch (e) {
    // unknown error
    console.error(`Unknown error while matching log: ${e.message}`);
    throw e;
  }
};
