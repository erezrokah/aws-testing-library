/* eslint-disable @typescript-eslint/no-var-requires */
import chai = require('chai');
import './';
import kinesis from './kinesis';

jest.mock('../common');
jest.mock('../utils/kinesis');

chai.use(kinesis);

describe('kinesis', () => {
  describe('record', () => {
    const region = 'region';
    const stream = 'stream';
    const props = { region, stream };
    const matcher = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on existsInStream error', async () => {
      const { verifyProps } = require('../common');
      const { existsInStream } = require('../utils/kinesis');

      const error = new Error('Unknown error');
      existsInStream.mockReturnValue(Promise.reject(error));

      expect.assertions(5);

      let received = null;
      try {
        await chai.expect(props).to.have.record(matcher);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, matcher }, [
        'region',
        'stream',
        'matcher',
      ]);

      expect(existsInStream).toHaveBeenCalledTimes(1);
      expect(existsInStream).toHaveBeenCalledWith(
        region,
        stream,
        matcher,
        10 * 1000,
        500,
      );
    });

    test('should pass on have record', async () => {
      const { existsInStream } = require('../utils/kinesis');

      existsInStream.mockReturnValue(Promise.resolve(true));

      expect.assertions(2);

      // should not throw error on record exists
      await chai.expect(props).to.have.record(matcher);

      try {
        // should throw error on no record
        existsInStream.mockReturnValue(Promise.resolve(false));
        await chai.expect(props).to.have.record(matcher);
      } catch (error) {
        const e = error as Error;
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(`expected ${stream} to have record`);
      }
    });

    test('should pass on not have record', async () => {
      const { existsInStream } = require('../utils/kinesis');

      existsInStream.mockReturnValue(Promise.resolve(false));

      expect.assertions(2);

      // should not throw error on no record
      await chai.expect(props).to.not.have.record(matcher);

      try {
        // should throw error on record exists
        existsInStream.mockReturnValue(Promise.resolve(true));
        await chai.expect(props).to.not.have.record(matcher);
      } catch (error) {
        const e = error as Error;
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(`expected ${stream} not to have record`);
      }
    });
  });
});
