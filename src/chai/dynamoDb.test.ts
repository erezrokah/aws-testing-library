import chai = require('chai');
import dynamoDb from './dynamoDb';

jest.mock('../common');
jest.mock('../utils/dynamoDb');

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

      const error = new Error('Unknown error');
      getItem.mockReturnValue(Promise.reject(error));

      expect.assertions(5);

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
  });
});
