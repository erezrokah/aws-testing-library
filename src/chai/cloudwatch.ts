import { epochDateMinusHours, verifyProps } from '../common';
import { expectedProps, ICloudwatchProps } from '../common/cloudwatch';
import { filterLogEvents } from '../utils/cloudwatch';
import { wrapWithRetries } from './utils';

const attemptCloudwatch = async function(this: any, pattern: string) {
  const props = this._obj as ICloudwatchProps;

  verifyProps({ ...props, pattern }, expectedProps);

  const {
    region,
    function: functionName,
    startTime = epochDateMinusHours(1),
  } = props;
  const { events } = await filterLogEvents(
    region,
    functionName,
    startTime,
    pattern,
  );
  const found = events.length > 0;

  return {
    message: `expected ${functionName} to have log matching ${pattern}`,
    negateMessage: `expected ${functionName} not to have log matching ${pattern}`,
    pass: found,
  };
};

const cloudwatch = (chai: any) => {
  chai.Assertion.addMethod('log', async function(this: any, pattern: string) {
    const wrapped = wrapWithRetries(attemptCloudwatch);
    const { pass, message, negateMessage } = await wrapped.apply(this, [
      pattern,
    ]);

    this.assert(pass, message, negateMessage);
  });
};

export default cloudwatch;
