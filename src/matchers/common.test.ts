import * as common from './common';

jest.useFakeTimers();

describe('common', () => {
  describe('sleep', () => {
    test('should call setTimeout', async () => {
      const promise = common.sleep(1000);
      jest.runAllTimers();

      await promise;

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });
  });
  describe('verifyProps', () => {
    test('should throw error on missing prop', () => {
      expect(() => common.verifyProps({}, ['id'])).toThrowError(
        new Error('Missing id from received props'),
      );
    });

    test('should not throw error on no missing prop', () => {
      expect(() => common.verifyProps({ id: 'value' }, ['id'])).not.toThrow();
    });
  });

  describe('wrapWithRetries', () => {
    let arr = [{ pass: true, isNot: false }, { pass: false, isNot: true }];
    arr.forEach(({ pass, isNot }) => {
      test(`should retry once on pass === ${pass}, isNot === ${isNot}`, async () => {
        const toWrap = jest.fn();
        const expectedResult = { pass, message: () => '' };
        toWrap.mockReturnValue(Promise.resolve(expectedResult));

        const matcherUtils = {
          isNot,
        } as any;

        const props = { region: 'region' };
        const key = 'key';

        const wrapped = common.wrapWithRetries(toWrap);
        const result = await wrapped.bind(matcherUtils)(props, key);

        expect(toWrap).toHaveBeenCalledTimes(1);
        expect(toWrap).toHaveBeenCalledWith(props, key);
        expect(result).toBe(expectedResult);
      });
    });

    arr = [{ pass: false, isNot: false }, { pass: true, isNot: true }];
    arr.forEach(({ pass, isNot }) => {
      test(`should exhaust timeout on pass === ${pass}, isNot === ${isNot}`, async () => {
        // tslint:disable-next-line:no-shadowed-variable
        const common = require('./common');

        const mockedNow = jest.fn();
        Date.now = mockedNow;
        mockedNow.mockReturnValueOnce(0);
        mockedNow.mockReturnValueOnce(250);
        mockedNow.mockReturnValueOnce(500);
        mockedNow.mockReturnValueOnce(750);
        mockedNow.mockReturnValueOnce(1000);
        mockedNow.mockReturnValueOnce(1250);

        common.sleep = jest.fn();

        const toWrap = jest.fn();
        const expectedResult = { pass, message: () => '' };
        toWrap.mockReturnValue(Promise.resolve(expectedResult));

        const matcherUtils = {
          isNot,
        };

        const props = { timeout: 1001, pollEvery: 250 };
        const key = 'key';

        const wrapped = common.wrapWithRetries(toWrap);
        const result = await wrapped.bind(matcherUtils)(props, key);

        expect(toWrap).toHaveBeenCalledTimes(5);
        expect(toWrap).toHaveBeenCalledWith(props, key);
        expect(result).toBe(expectedResult);
        expect(common.sleep).toHaveBeenCalledTimes(4);
        expect(common.sleep).toHaveBeenCalledWith(props.pollEvery);
      });
    });

    test('should retry twice, { pass: false, isNot: false } => { pass: true, isNot: false }', async () => {
      // tslint:disable-next-line:no-shadowed-variable
      const common = require('./common');

      const mockedNow = jest.fn();
      Date.now = mockedNow;
      mockedNow.mockReturnValueOnce(0);
      mockedNow.mockReturnValueOnce(250);
      mockedNow.mockReturnValueOnce(500);

      common.sleep = jest.fn();

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
      };

      const props = {};
      const key = 'key';

      const wrapped = common.wrapWithRetries(toWrap);
      const result = await wrapped.bind(matcherUtils)(props, key);

      expect(toWrap).toHaveBeenCalledTimes(2);
      expect(toWrap).toHaveBeenCalledWith(props, key);
      expect(result).toBe(expectedResult);
      expect(common.sleep).toHaveBeenCalledTimes(1);
      expect(common.sleep).toHaveBeenCalledWith(500); // default pollEvery
    });
  });
});
