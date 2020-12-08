import { verifyProps } from '../common';
import { expectedProps, IKinesisProps } from '../common/kinesis';
import { existsInStream, IRecordMatcher } from '../utils/kinesis';

const kinesis = (chai: any) => {
  chai.Assertion.addMethod(
    'record',
    async function (this: any, matcher: IRecordMatcher) {
      const props = this._obj as IKinesisProps;
      verifyProps({ ...props, matcher }, expectedProps);

      const { region, stream, timeout = 10 * 1000, pollEvery = 500 } = props;
      const found = await existsInStream(
        region,
        stream,
        matcher,
        timeout,
        pollEvery,
      );

      this.assert(
        found,
        `expected ${stream} to have record`,
        `expected ${stream} not to have record`,
      );
    },
  );
};

export default kinesis;
