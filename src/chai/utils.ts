import { ICommonProps, sleep } from '../common';

interface IMatchResult {
  pass: boolean;
  message: string;
  negateMessage: string;
}

export const wrapWithRetries = (
  matcher: (...args: any[]) => Promise<IMatchResult>,
) => {
  async function wrapped(this: any, ...args: any[]) {
    const props = this._obj as ICommonProps;
    const { negate } = this.__flags;

    const { timeout = 2500, pollEvery = 500 } = props;

    const start = Date.now();
    let result = await (matcher.apply(this, args) as Promise<IMatchResult>);
    while (Date.now() - start < timeout) {
      // expecting pass === false
      if (negate && !result.pass) {
        return result;
      }
      // expecting pass === true
      if (!negate && result.pass) {
        return result;
      }

      // retry
      await sleep(pollEvery);

      result = await (matcher.apply(this, args) as Promise<IMatchResult>);
    }
    return result;
  }
  return wrapped;
};
