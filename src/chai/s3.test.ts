import chai = require('chai');
import s3 from './s3';

jest.mock('../common');
jest.mock('../utils/s3');

chai.use(s3);

describe('s3', () => {
  describe('object', () => {
    const region = 'region';
    const bucket = 'bucket';
    const props = { region, bucket };
    const key = 'key';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on existsInStream error', async () => {
      const { verifyProps } = require('../common');
      const { getObject } = require('../utils/s3');

      const error = new Error('Unknown error');
      getObject.mockReturnValue(Promise.reject(error));

      expect.assertions(5);

      let received = null;
      try {
        await chai.expect(props).to.have.object(key);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, key }, [
        'region',
        'bucket',
        'key',
      ]);

      expect(getObject).toHaveBeenCalledTimes(1);
      expect(getObject).toHaveBeenCalledWith(region, bucket, key);
    });

    test('should pass on have object', async () => {
      const { getObject } = require('../utils/s3');

      getObject.mockReturnValue(Promise.resolve({ found: true }));

      expect.assertions(2);

      // should not throw error on object exists
      await chai.expect(props).to.have.object(key);

      try {
        // should throw error on no object
        getObject.mockReturnValue(Promise.resolve({ found: false }));
        await chai.expect(props).to.have.object(key);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${bucket} to have object with key ${key}`,
        );
      }
    });

    test('should pass on not have record', async () => {
      const { getObject } = require('../utils/s3');

      getObject.mockReturnValue(Promise.resolve({ found: false }));

      expect.assertions(2);

      // should not throw error on no object
      await chai.expect(props).to.not.have.object(key);

      try {
        // should throw error on object exists
        getObject.mockReturnValue(Promise.resolve({ found: true }));
        await chai.expect(props).to.not.have.object(key);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${bucket} not to have object with key ${key}`,
        );
      }
    });
  });
});
