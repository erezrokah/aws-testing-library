import { epochDateMinusHours, verifyProps } from '../common';
import { expectedProps, ICloudwatchProps } from '../common/cloudwatch';
import { filterLogEvents, getLogGroupName } from '../utils/cloudwatch';
import { wrapWithRetries } from './utils';

const attemptCloudwatch = async function (this: any, pattern: string) {
  const props = this._obj as ICloudwatchProps;

  verifyProps({ ...props, pattern }, expectedProps);

  const {
    region,
    function: functionName,
    startTime = epochDateMinusHours(1),
    logGroupName,
  } = props;

  const { events } = await filterLogEvents(
    region,
    logGroupName || getLogGroupName(functionName || ''),
    startTime,
    pattern,
  );
  const found = events.length > 0;

  const messageSubject = logGroupName || functionName;
  return {
    message: `expected ${messageSubject} to have log matching ${pattern}`,
    negateMessage: `expected ${messageSubject} not to have log matching ${pattern}`,
    pass: found,
  };
};

const cloudwatch = (chai: any) => {
  chai.Assertion.addMethod('log', async function (this: any, pattern: string) {
    const wrapped = wrapWithRetries(attemptCloudwatch);
    const { pass, message, negateMessage } = await wrapped.apply(this, [
      pattern,
    ]);

    this.assert(pass, message, negateMessage);
  });
};

export default cloudwatch;
