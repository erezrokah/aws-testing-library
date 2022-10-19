import { EOL } from 'os';
import {
  expectedProps,
  ICloudwatchProps,
  ToHaveLogOptions,
} from '../common/cloudwatch';
import { epochDateMinusHours, verifyProps } from '../common/index';
import { filterLogEvents, getLogGroupName } from '../utils/cloudwatch';

export const toHaveLog = async function (
  this: jest.MatcherUtils,
  props: ICloudwatchProps,
  pattern: string,
  { isPatternMetricFilterForJSON = false }: ToHaveLogOptions = {},
) {
  verifyProps({ ...props, pattern }, expectedProps);
  const {
    region,
    function: functionName,
    startTime = epochDateMinusHours(1),
    logGroupName,
  } = props;

  try {
    const messageSubject = this.utils.printExpected(
      logGroupName || functionName,
    );
    const printRegion = this.utils.printExpected(region);
    const printPattern = this.utils.printExpected(pattern) + EOL;

    const notHint = this.utils.matcherHint('.not.toHaveLog') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveLog') + EOL + EOL;

    const { events } = await filterLogEvents(
      region,
      logGroupName || getLogGroupName(functionName || ''),
      startTime,
      pattern,
      isPatternMetricFilterForJSON ?? false,
    );
    const found = events.length > 0;
    if (found) {
      // matching log found
      return {
        message: () =>
          `${notHint}Expected ${messageSubject} at region ${printRegion} not to have log matching pattern ${printPattern}`,
        pass: true,
      };
    } else {
      // matching log not found
      return {
        message: () =>
          `${hint}Expected ${messageSubject} at region ${printRegion} to have log matching pattern ${printPattern}`,
        pass: false,
      };
    }
  } catch (error) {
    const e = error as Error;
    // unknown error
    console.error(`Unknown error while matching log: ${e.message}`);
    throw e;
  }
};
