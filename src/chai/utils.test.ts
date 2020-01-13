import { ICommonProps } from '../common';
import { wrapWithRetries } from './utils';

jest.mock('../common');

describe('utils', () => {
  describe('wrapWithRetries', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    let arr = [
      { pass: true, negate: false },
      { pass: false, negate: true },
    ];
    arr.forEach(({ pass, negate }) => {
      test(`should retry once on pass === ${pass}, negate === ${negate}`, async () => {
        const toWrap = jest.fn();
        const expectedResult = { pass, message: () => '' };
        toWrap.mockReturnValue(Promise.resolve(expectedResult));

        const props = { region: 'region' } as ICommonProps;
        const context = {
          __flags: { negate },
          _obj: props,
        } as any;

        const key = 'key';

        const wrapped = wrapWithRetries(toWrap);
        const result = await wrapped.bind(context)(key);

        expect(toWrap).toHaveBeenCalledTimes(1);
        expect(toWrap).toHaveBeenCalledWith(key);
        expect(result).toBe(expectedResult);
      });
    });

    arr = [
      { pass: false, negate: false },
      { pass: true, negate: true },
    ];
    arr.forEach(({ pass, negate }) => {
      test(`should exhaust timeout on pass === ${pass}, negate === ${negate}`, async () => {
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

        const props = { timeout: 1001, pollEvery: 250 } as ICommonProps;
        const context = {
          __flags: { negate },
          _obj: props,
        } as any;

        const key = 'key';

        const wrapped = wrapWithRetries(toWrap);
        const result = await wrapped.bind(context)(key);

        expect(toWrap).toHaveBeenCalledTimes(5);
        expect(toWrap).toHaveBeenCalledWith(key);
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

      const props = {} as ICommonProps;
      const context = {
        __flags: { negate: false },
        _obj: props,
      } as any;

      const key = 'key';

      const wrapped = wrapWithRetries(toWrap);
      const result = await wrapped.bind(context)(key);

      expect(toWrap).toHaveBeenCalledTimes(2);
      expect(toWrap).toHaveBeenCalledWith(key);
      expect(result).toBe(expectedResult);
      expect(sleep).toHaveBeenCalledTimes(1);
      expect(sleep).toHaveBeenCalledWith(500); // default pollEvery
    });
  });
});
