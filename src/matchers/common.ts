export interface ICommonProps {
  region: string;
  timeout?: number;
  pollEvery?: number;
}

interface IMatchResult {
  pass: boolean;
  message: () => string;
}

export const sleep = async (ms: number) => {
  return await new Promise(resolve => setTimeout(resolve, ms));
};

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
    let result = await (matcher.apply(this, [props, ...args]) as Promise<
      IMatchResult
    >);
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
      await module.exports.sleep(pollEvery);

      result = await (matcher.apply(this, [props, ...args]) as Promise<
        IMatchResult
      >);
    }
    return result;
  }
  return wrapped;
};

export const verifyProps = (props: any, expectedProps: string[]) => {
  for (const prop of expectedProps) {
    const value = props[prop];
    if (!value) {
      throw new Error(`Missing ${prop} from received props`);
    }
  }
};
