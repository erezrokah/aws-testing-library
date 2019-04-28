import { verifyProps } from '../common';
import { expectedProps, ICloudwatchProps } from '../common/cloudwatch';
import { filterLogEvents } from '../utils/cloudwatch';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      log: (pattern: string) => Assertion;
    }
  }
}

const cloudwatch = (chai: any) => {
  chai.Assertion.addMethod('log', async function(this: any, pattern: string) {
    const props = this._obj as ICloudwatchProps;

    verifyProps({ ...props, pattern }, expectedProps);

    const { region, function: functionName } = props;
    const { events } = await filterLogEvents(region, functionName, pattern);
    const found = events.length > 0;

    this.assert(
      found,
      `expected ${functionName} to have log matching ${pattern}`,
      `expected ${functionName} not to have log matching ${pattern}`,
    );
  });
};

export default cloudwatch;
