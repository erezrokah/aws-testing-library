import chai = require('chai');
import s3 from './sqs';

jest.mock('../common');
jest.mock('../utils/sqs');
jest.mock('./utils', () => {
  return { wrapWithRetries: jest.fn(f => f) };
});

chai.use(s3);

describe('sqs', () => {
  describe('message', () => {
    const region = 'region';
    const queueUrl = 'queueUrl';
    const props = { region, queueUrl };
    const matcher = jest.fn();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on existsInQueue error', async () => {
      const { verifyProps } = require('../common');
      const { existsInQueue } = require('../utils/sqs');
      const { wrapWithRetries } = require('./utils');

      const error = new Error('Unknown error');
      existsInQueue.mockReturnValue(Promise.reject(error));

      expect.assertions(6);

      let received = null;
      try {
        await chai.expect(props).to.have.message(matcher);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, matcher }, [
        'region',
        'queueUrl',
        'matcher',
      ]);

      expect(existsInQueue).toHaveBeenCalledTimes(1);
      expect(existsInQueue).toHaveBeenCalledWith(region, queueUrl, matcher);

      expect(wrapWithRetries).toHaveBeenCalledTimes(1);
    });

    test('should pass on have message', async () => {
      const { existsInQueue } = require('../utils/sqs');

      existsInQueue.mockReturnValue(Promise.resolve(true));

      expect.assertions(2);

      // should not throw error on message exists
      await chai.expect(props).to.have.message(matcher);

      try {
        // should throw error on no message
        existsInQueue.mockReturnValue(Promise.resolve(false));
        await chai.expect(props).to.have.message(matcher);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(`expected ${queueUrl} to have message`);
      }
    });

    test('should pass on not have record', async () => {
      const { existsInQueue } = require('../utils/sqs');

      existsInQueue.mockReturnValue(Promise.resolve(false));

      expect.assertions(2);

      // should not throw error on no message
      await chai.expect(props).to.not.have.message(matcher);

      try {
        // should throw error on message exists
        existsInQueue.mockReturnValue(Promise.resolve(true));
        await chai.expect(props).to.not.have.message(matcher);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(`expected ${queueUrl} not to have message`);
      }
    });
  });
});
