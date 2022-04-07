/* eslint-disable @typescript-eslint/no-var-requires */
import { ICommonProps } from '../common';
import { wrapWithRetries, wrapWithRetryUntilPass } from './utils';

jest.mock('../common');

describe('utils', () => {
  describe('wrapWithRetries', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    let arr = [
      { pass: true, isNot: false },
      { pass: false, isNot: true },
    ];
    arr.forEach(({ pass, isNot }) => {
      test(`should retry once on pass === ${pass}, isNot === ${isNot}`, async () => {
        const toWrap = jest.fn();
        const expectedResult = { pass, message: () => '' };
        toWrap.mockReturnValue(Promise.resolve(expectedResult));

        const matcherUtils = {
          isNot,
        } as jest.MatcherUtils;

        const props = { region: 'region' } as ICommonProps;
        const key = 'key';

        const wrapped = wrapWithRetries(toWrap);
        const result = await wrapped.bind(matcherUtils)(props, key);

        expect(toWrap).toHaveBeenCalledTimes(1);
        expect(toWrap).toHaveBeenCalledWith(props, key);
        expect(result).toBe(expectedResult);
      });
    });

    arr = [
      { pass: false, isNot: false },
      { pass: true, isNot: true },
    ];
    arr.forEach(({ pass, isNot }) => {
      test(`should exhaust timeout on pass === ${pass}, isNot === ${isNot}`, async () => {
        const { sleep } = require('../common');

        const mockedNow = jest.fn();
        Date.now = mockedNow;
        mockedNow.mockReturnValueOnce(0);
        mockedNow.mockReturnValueOnce(250);
        mockedNow.mockReturnValueOnce(500);
        mockedNow.mockReturnValueOnce(750);
        mockedNow.mockReturnValueOnce(1000);
        mockedNow.mockReturnValueOnce(1250);

        const toWrap = jest.fn();
        const expectedResult = { pass, message: () => '' };
        toWrap.mockReturnValue(Promise.resolve(expectedResult));

        const matcherUtils = {
          isNot,
        } as jest.MatcherUtils;

        const props = { timeout: 1001, pollEvery: 250 } as ICommonProps;
        const key = 'key';

        const wrapped = wrapWithRetries(toWrap);
        const result = await wrapped.bind(matcherUtils)(props, key);

        expect(toWrap).toHaveBeenCalledTimes(5);
        expect(toWrap).toHaveBeenCalledWith(props, key);
        expect(result).toBe(expectedResult);
        expect(sleep).toHaveBeenCalledTimes(4);
        expect(sleep).toHaveBeenCalledWith(props.pollEvery);
      });
    });

    test('should retry twice, { pass: false, isNot: false } => { pass: true, isNot: false }', async () => {
      const { sleep } = require('../common');

      const mockedNow = jest.fn();
      Date.now = mockedNow;
      mockedNow.mockReturnValueOnce(0);
      mockedNow.mockReturnValueOnce(250);
      mockedNow.mockReturnValueOnce(500);

      const toWrap = jest.fn();
      // first attempt returns pass === false
      toWrap.mockReturnValueOnce(
        Promise.resolve({ pass: false, message: () => '' }),
      );

      // second attempt returns pass === true
      const expectedResult = { pass: true, message: () => '' };
      toWrap.mockReturnValueOnce(Promise.resolve(expectedResult));

      const matcherUtils = {
        isNot: false,
      } as jest.MatcherUtils;

      const props = {} as ICommonProps;
      const key = 'key';

      const wrapped = wrapWithRetries(toWrap);
      const result = await wrapped.bind(matcherUtils)(props, key);

      expect(toWrap).toHaveBeenCalledTimes(2);
      expect(toWrap).toHaveBeenCalledWith(props, key);
      expect(result).toBe(expectedResult);
      expect(sleep).toHaveBeenCalledTimes(1);
      expect(sleep).toHaveBeenCalledWith(500); // default pollEvery
    });
  });

  describe('wrapWithRetryUntilPass', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should retry once on pass === true', async () => {
      const toWrap = jest.fn();
      const expectedResult = { pass: true, message: () => '' };
      toWrap.mockReturnValue(Promise.resolve(expectedResult));

      const matcherUtils = {} as jest.MatcherUtils;

      const props = { region: 'region' } as ICommonProps;
      const key = 'key';

      const wrapped = wrapWithRetryUntilPass(toWrap);
      const result = await wrapped.bind(matcherUtils)(props, key);

      expect(toWrap).toHaveBeenCalledTimes(1);
      expect(toWrap).toHaveBeenCalledWith(props, key);
      expect(result).toBe(expectedResult);
    });

    test('should exhaust timeout on pass === false', async () => {
      const { sleep } = require('../common');

      const mockedNow = jest.fn();
      Date.now = mockedNow;
      mockedNow.mockReturnValueOnce(0);
      mockedNow.mockReturnValueOnce(250);
      mockedNow.mockReturnValueOnce(500);
      mockedNow.mockReturnValueOnce(750);
      mockedNow.mockReturnValueOnce(1000);
      mockedNow.mockReturnValueOnce(1250);

      const toWrap = jest.fn();
      const expectedResult = { pass: false, message: () => '' };
      toWrap.mockReturnValue(Promise.resolve(expectedResult));

      const matcherUtils = {} as jest.MatcherUtils;

      const props = { timeout: 1001, pollEvery: 250 } as ICommonProps;
      const key = 'key';

      const wrapped = wrapWithRetryUntilPass(toWrap);
      const result = await wrapped.bind(matcherUtils)(props, key);

      expect(toWrap).toHaveBeenCalledTimes(5);
      expect(toWrap).toHaveBeenCalledWith(props, key);
      expect(result).toBe(expectedResult);
      expect(sleep).toHaveBeenCalledTimes(4);
      expect(sleep).toHaveBeenCalledWith(props.pollEvery);
    });

    test('should retry twice, { pass: false, isNot: false } => { pass: true, isNot: false }', async () => {
      const { sleep } = require('../common');

      const mockedNow = jest.fn();
      Date.now = mockedNow;
      mockedNow.mockReturnValueOnce(0);
      mockedNow.mockReturnValueOnce(250);
      mockedNow.mockReturnValueOnce(500);

      const toWrap = jest.fn();
      // first attempt returns pass === false
      toWrap.mockReturnValueOnce(
        Promise.resolve({ pass: false, message: () => '' }),
      );

      // second attempt returns pass === true
      const expectedResult = { pass: true, message: () => '' };
      toWrap.mockReturnValueOnce(Promise.resolve(expectedResult));

      const matcherUtils = {
        isNot: false,
      } as jest.MatcherUtils;

      const props = {} as ICommonProps;
      const key = 'key';

      const wrapped = wrapWithRetryUntilPass(toWrap);
      const result = await wrapped.bind(matcherUtils)(props, key);

      expect(toWrap).toHaveBeenCalledTimes(2);
      expect(toWrap).toHaveBeenCalledWith(props, key);
      expect(result).toBe(expectedResult);
      expect(sleep).toHaveBeenCalledTimes(1);
      expect(sleep).toHaveBeenCalledWith(500); // default pollEvery
    });
  });
});
