/* eslint-disable @typescript-eslint/no-var-requires */
import chai = require('chai');
import * as common from '../common';
import './';
import cloudwatch from './cloudwatch';

jest.mock('../utils/cloudwatch');
jest.mock('./utils', () => {
  return { wrapWithRetries: jest.fn((f) => f) };
});

jest.spyOn(Date, 'parse').mockImplementation(() => 12 * 60 * 60 * 1000);
jest.spyOn(common, 'verifyProps');
jest.spyOn(common, 'epochDateMinusHours');

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

      const { getLogGroupName } = require('../utils/cloudwatch');
      getLogGroupName.mockImplementation(
        (functionName: string) => `/aws/lambda/${functionName}`,
      );
    });

    test('should throw error on filterLogEvents error', async () => {
      const { verifyProps } = require('../common');
      const { filterLogEvents } = require('../utils/cloudwatch');
      const { wrapWithRetries } = require('./utils');

      const error = new Error('Unknown error');
      filterLogEvents.mockReturnValue(Promise.reject(error));

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
        'pattern',
      ]);

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        region,
        `/aws/lambda/${functionName}`,
        startTime,
        pattern,
        false,
      );
      expect(wrapWithRetries).toHaveBeenCalledTimes(1);
    });

    test('startTime should be defaulted when not passed in', async () => {
      const { epochDateMinusHours, verifyProps } = require('../common');
      const { filterLogEvents } = require('../utils/cloudwatch');

      filterLogEvents.mockReturnValue(Promise.resolve({ events: ['event'] }));
      epochDateMinusHours.mockReturnValue(11 * 60 * 60 * 1000);

      const propsNoTime = { region, function: functionName };
      await chai.expect(propsNoTime).to.have.log(pattern);

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        propsNoTime.region,
        `/aws/lambda/${functionName}`,
        11 * 60 * 60 * 1000,
        pattern,
        false,
      );
      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...propsNoTime, pattern }, [
        'region',
        'pattern',
      ]);
    });

    test('should pass custom log group name to filterLogEvents', async () => {
      const { filterLogEvents } = require('../utils/cloudwatch');

      filterLogEvents.mockReturnValue(Promise.resolve({ events: ['event'] }));

      await chai
        .expect({ ...props, logGroupName: 'customLogGroup' })
        .to.have.log(pattern);

      expect(filterLogEvents).toHaveBeenCalledTimes(1);
      expect(filterLogEvents).toHaveBeenCalledWith(
        props.region,
        'customLogGroup',
        props.startTime,
        pattern,
        false,
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
      } catch (error) {
        const e = error as Error;
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${functionName} to have log matching ${pattern}`,
        );
      }
    });

    test('should pass when an event is found for a json log', async () => {
      const { filterLogEvents } = require('../utils/cloudwatch');

      const events = [JSON.stringify({ message: 'this is a json log event' })];
      filterLogEvents.mockReturnValue(Promise.resolve({ events }));

      const jsonPattern = '{$.message = "this is a json log event"}';
      await chai
        .expect(props)
        .to.have.log(jsonPattern, { isPatternMetricFilterForJSON: true });

      try {
        // should throw error on no events
        filterLogEvents.mockReturnValue(Promise.resolve({ events: [] }));
        await chai
          .expect(props)
          .to.have.log(pattern, { isPatternMetricFilterForJSON: true });
      } catch (error) {
        const e = error as Error;
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
      } catch (error) {
        const e = error as Error;
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${functionName} not to have log matching ${pattern}`,
        );
      }
    });
  });
});
