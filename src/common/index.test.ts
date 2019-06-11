import { epochDateMinusHours, sleep, verifyProps } from './';

jest.useFakeTimers();

describe('common', () => {
  describe('sleep', () => {
    test('should call setTimeout', async () => {
      const promise = sleep(1000);
      jest.runAllTimers();

      await promise;

      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenCalledWith(expect.any(Function), 1000);
    });
  });

  describe('verifyProps', () => {
    test('should throw error on missing prop', () => {
      expect(() => verifyProps({}, ['id'])).toThrowError(
        new Error('Missing id from received props'),
      );
    });

    test('should not throw error on no missing prop', () => {
      expect(() => verifyProps({ id: 'value' }, ['id'])).not.toThrow();
    });
  });

  describe('epochDateMinusHours', () => {
    jest.spyOn(Date, 'parse').mockImplementation(() => 12 * 60 * 60 * 1000);

    test('test implementation', () => {
      const actual = epochDateMinusHours(1);

      expect(actual).toEqual(11 * 60 * 60 * 1000);
    });
  });
});
