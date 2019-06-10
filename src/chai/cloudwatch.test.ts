import chai = require('chai');
import './';
import cloudwatch from './cloudwatch';

jest.mock('../common');
jest.mock('../utils/cloudwatch');
jest.mock('./utils', () => {
  return { wrapWithRetries: jest.fn(f => f) };
});

jest.spyOn(Date, 'parse').mockImplementation(() => 12 * 60 * 60 * 1000);

chai.use(cloudwatch);

describe('cloudwatch', () => {
  describe('log', () => {
    const region = 'region';
    const functionName = 'functionName';
    const startTime = 12 * 60 * 60 * 1000;

    const props = { region, function: functionName, startTime };
    const pattern = 'pattern';

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on filterLogEvents error', async () => {
      const { epochDateMinusHours, verifyProps } = require('../common');
      const { filterLogEvents } = require('../utils/cloudwatch');
      const { wrapWithRetries } = require('./utils');

      const error = new Error('Unknown error');
      filterLogEvents.mockReturnValue(Promise.reject(error));

      epochDateMinusHours.mockReturnValue(11 * 60 * 60 * 1000);

      expect.assertions(6);

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
        'startTime',
        'pattern',
      ]);

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        region,
        functionName,
        startTime,
        pattern,
      );
      expect(wrapWithRetries).toHaveBeenCalledTimes(1);
    });

    test('startTime should be defaulted when not passed in', async () => {
      const { epochDateMinusHours, verifyProps } = require('../common');
      const { filterLogEvents } = require('../utils/cloudwatch');

      filterLogEvents.mockReturnValue(Promise.resolve({ events: ['event'] }));
      epochDateMinusHours.mockReturnValue(11 * 60 * 60 * 1000);

      const props = { region, function: functionName };
      await chai.expect(props).to.have.log(pattern);

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        props.region,
        props.function,
        11 * 60 * 60 * 1000,
        pattern,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, pattern }, [
        'region',
        'function',
        'startTime',
        'pattern',
      ]);
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
