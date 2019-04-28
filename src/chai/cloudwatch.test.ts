import chai = require('chai');
import cloudwatch from './cloudwatch';

jest.mock('../common');
jest.mock('../utils/cloudwatch');

chai.use(cloudwatch);

describe('cloudwatch', () => {
  describe('log', () => {
    const region = 'region';
    const functionName = 'functionName';

    const props = { region, function: functionName };
    const pattern = 'pattern';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on filterLogEvents error', async () => {
      const { verifyProps } = require('../common');
      const { filterLogEvents } = require('../utils/cloudwatch');

      const error = new Error('Unknown error');
      filterLogEvents.mockReturnValue(Promise.reject(error));

      expect.assertions(5);

      let received = null;
      try {
        await chai.expect(props).to.have.log(pattern);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, pattern }, [
        'region',
        'function',
        'pattern',
      ]);

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        region,
        functionName,
        pattern,
      );
    });

    test('should pass on have log', async () => {
      const { filterLogEvents } = require('../utils/cloudwatch');

      filterLogEvents.mockReturnValue(Promise.resolve({ events: ['event'] }));

      expect.assertions(2);

      // should not throw error on some events
      await chai.expect(props).to.have.log(pattern);

      try {
        // should throw error on no events
        filterLogEvents.mockReturnValue(Promise.resolve({ events: [] }));
        await chai.expect(props).to.have.log(pattern);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${functionName} to have log matching ${pattern}`,
        );
      }
    });

    test('should pass on not have log', async () => {
      const { filterLogEvents } = require('../utils/cloudwatch');

      filterLogEvents.mockReturnValue(Promise.resolve({ events: [] }));

      expect.assertions(2);

      // should not throw error on no events
      await chai.expect(props).to.not.have.log(pattern);

      try {
        // should throw error on some events
        filterLogEvents.mockReturnValue(Promise.resolve({ events: ['event'] }));
        await chai.expect(props).to.not.have.log(pattern);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${functionName} not to have log matching ${pattern}`,
        );
      }
    });
  });
});
