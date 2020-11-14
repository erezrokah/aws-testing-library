/* eslint-disable @typescript-eslint/no-var-requires */
import chai = require('chai');
import './';
import dynamoDb from './dynamoDb';

jest.mock('../common');
jest.mock('../utils/dynamoDb');
jest.mock('./utils', () => {
  return { wrapWithRetries: jest.fn((f) => f) };
});

chai.use(dynamoDb);

describe('dynamoDb', () => {
  describe('item', () => {
    const region = 'region';
    const table = 'table';
    const props = { region, table };
    const key = { id: { S: 'id' } };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    test('should throw error on filterLogEvents error', async () => {
      const { verifyProps } = require('../common');
      const { getItem } = require('../utils/dynamoDb');
      const { wrapWithRetries } = require('./utils');

      const error = new Error('Unknown error');
      getItem.mockReturnValue(Promise.reject(error));

      expect.assertions(6);

      let received = null;
      try {
        await chai.expect(props).to.have.item(key);
      } catch (e) {
        received = e;
      }

      expect(error).toBe(received);

      expect(verifyProps).toHaveBeenCalledTimes(1);
      expect(verifyProps).toHaveBeenCalledWith({ ...props, key }, [
        'region',
        'table',
        'key',
      ]);

      expect(getItem).toHaveBeenCalledTimes(1);
      expect(getItem).toHaveBeenCalledWith(region, table, key);

      expect(wrapWithRetries).toHaveBeenCalledTimes(1);
    });

    test('should pass on have item', async () => {
      const { getItem } = require('../utils/dynamoDb');

      getItem.mockReturnValue(Promise.resolve({ id: 'id1' }));

      expect.assertions(2);

      // should not throw error on item exists
      await chai.expect(props).to.have.item(key);

      try {
        // should throw error on no item
        getItem.mockReturnValue(Promise.resolve(undefined));
        await chai.expect(props).to.have.item(key);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${table} to have item with key ${JSON.stringify(key)}`,
        );
      }
    });

    test('should pass on not have item', async () => {
      const { getItem } = require('../utils/dynamoDb');

      getItem.mockReturnValue(Promise.resolve(undefined));

      expect.assertions(2);

      // should not throw error on no item
      await chai.expect(props).to.not.have.item(key);

      try {
        // should throw error on item exists
        getItem.mockReturnValue(Promise.resolve({ id: 'id1' }));
        await chai.expect(props).to.not.have.item(key);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          `expected ${table} not to have item with key ${JSON.stringify(key)}`,
        );
      }
    });

    test('should pass on item equals', async () => {
      const { getItem } = require('../utils/dynamoDb');

      getItem.mockReturnValue(Promise.resolve({ id: { S: 'someId' } }));

      expect.assertions(2);

      const expected = { id: { S: 'someId' } };
      // should not throw error on item equals
      await chai.expect(props).to.have.item(key, expected);
      try {
        // should throw error on item not equals
        getItem.mockReturnValue(Promise.resolve({ id: 'otherId' }));
        await chai.expect(props).to.have.item(key, expected);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          "expected { id: { S: 'someId' } } to be equal to { id: 'otherId' }",
        );
      }
    });

    test('should pass on item not equals', async () => {
      const { getItem } = require('../utils/dynamoDb');

      getItem.mockReturnValue(Promise.resolve({ id: { S: 'otherId' } }));

      expect.assertions(2);

      const expected = { id: { S: 'someId' } };
      // should not throw error on item not equals
      await chai.expect(props).to.not.have.item(key, expected);
      try {
        // should throw error on item equals
        getItem.mockReturnValue(Promise.resolve({ id: { S: 'someId' } }));
        await chai.expect(props).to.not.have.item(key, expected);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          "expected { id: { S: 'someId' } } to not be equal to { id: { S: 'someId' } }",
        );
      }
    });

    test('should pass on item equals non strict mode', async () => {
      const { getItem } = require('../utils/dynamoDb');

      const actual = {
        id: { S: 'someId' },
        timestamp: { N: '10000000000' },
      };
      getItem.mockReturnValue(Promise.resolve(actual));

      expect.assertions(2);

      const expected = { id: { S: 'someId' } };
      // should not throw error on item equals non strict
      await chai.expect(props).to.have.item(key, expected, false);
      try {
        // should throw error on item not equals
        await chai.expect(props).to.have.item(key, expected, true);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          "expected { id: { S: 'someId' } } to be equal to { Object (id, timestamp) }",
        );
      }
    });

    test('should pass on item not equals non strict mode', async () => {
      const { getItem } = require('../utils/dynamoDb');

      const actual = {
        id: { S: 'someId' },
        timestamp: { N: '10000000000' },
      };
      getItem.mockReturnValue(Promise.resolve(actual));

      expect.assertions(2);

      const expected = { id: { S: 'someId' } };
      // should not throw error on item not equals
      await chai.expect(props).to.not.have.item(key, expected, true);
      try {
        // should throw error on item equals non strict
        await chai.expect(props).to.not.have.item(key, expected, false);
      } catch (e) {
        expect(e).toBeInstanceOf(chai.AssertionError);
        expect(e.message).toBe(
          "expected { id: { S: 'someId' } } to not be equal to { id: { S: 'someId' } }",
        );
      }
    });
  });
});
