import { EOL } from 'os';
import { filterLogEvents } from '../utils/cloudwatch';
import { ICommonProps, verifyProps } from './common';

interface ILambdaProps extends ICommonProps {
  function: string;
}

const expectedProps = ['region', 'function', 'pattern'];

export const toHaveLog = async function(
  this: jest.MatcherUtils,
  props: ILambdaProps,
  pattern: string,
) {
  verifyProps({ ...props, pattern }, expectedProps);

  const { region, function: functionName } = props;

  try {
    const printFunctionName = this.utils.printExpected(functionName);
    const printRegion = this.utils.printExpected(region);
    const printPattern = this.utils.printExpected(pattern) + EOL;

    const notHint = this.utils.matcherHint('.not.toMatchLog') + EOL + EOL;
    const hint = this.utils.matcherHint('.toMatchLog') + EOL + EOL;

    const { events } = await filterLogEvents(region, functionName, pattern);
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
    console.error(`Unknown error while looking for object: ${e.message}`);
    throw e;
  }
};
