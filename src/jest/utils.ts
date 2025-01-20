import { ICommonProps, sleep } from '../common';

interface IMatchResult {
  pass: boolean;
  message: () => string;
}

export const wrapWithRetries = (
  matcher: (this: jest.MatcherUtils, ...args: any[]) => Promise<IMatchResult>,
) => {
  async function wrapped(
    this: jest.MatcherUtils,
    props: ICommonProps,
    ...args: any[]
  ) {
    const { timeout = 2500, pollEvery = 500 } = props;

    const start = Date.now();
    let result = await (matcher.apply(this, [
      props,
      ...args,
    ]) as Promise<IMatchResult>);
    while (Date.now() - start < timeout) {
      // expecting pass === false
      if (this.isNot && !result.pass) {
        return result;
      }
      // expecting pass === true
      if (!this.isNot && result.pass) {
        return result;
      }

      // retry
      await sleep(pollEvery);

      result = await (matcher.apply(this, [
        props,
        ...args,
      ]) as Promise<IMatchResult>);
    }
    return result;
  }
  return wrapped;
};

export const wrapWithRetryUntilPass = (
  matcher: (this: jest.MatcherUtils, ...args: any[]) => Promise<IMatchResult>,
) => {
  async function wrapped(
    this: jest.MatcherUtils,
    props: ICommonProps,
    ...args: any[]
  ) {
    const { timeout = 2500, pollEvery = 500 } = props;

    const start = Date.now();
    let result = await (matcher.apply(this, [
      props,
      ...args,
    ]) as Promise<IMatchResult>);
    while (Date.now() - start < timeout) {
      // return since result is found
      if (result.pass) {
        return result;
      }

      // retry until result is found or timeout
      await sleep(pollEvery);

      result = await (matcher.apply(this, [
        props,
        ...args,
      ]) as Promise<IMatchResult>);
    }
    return result;
  }
  return wrapped;
};
