import { verifyProps } from './common';
describe('common', () => {
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
});
