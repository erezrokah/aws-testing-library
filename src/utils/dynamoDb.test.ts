import { clearAllItems, getItem } from './dynamoDb';

jest.mock('aws-sdk', () => {
  const scanValue = { promise: jest.fn() };
  const scan = jest.fn(() => scanValue);
  const deleteValue = { promise: jest.fn() };
  const dbDelete = jest.fn(() => deleteValue);
  const getValue = { promise: jest.fn() };
  const get = jest.fn(() => getValue);
  const DocumentClient = jest.fn(() => ({ scan, delete: dbDelete, get }));
  const DynamoDB = { DocumentClient };
  return { DynamoDB };
});

describe('dynamoDb utils', () => {
  const AWS = require('aws-sdk');
  const db = AWS.DynamoDB.DocumentClient;

  const [region, tableName] = ['region', 'tableName'];

  describe('clearAllItems', () => {
    test('should not call delete on empty db', async () => {
      const scan = db().scan;
      const dbDelete = db().delete;
      const promise = scan().promise;
      promise.mockReturnValue(Promise.resolve({ Items: undefined }));

      jest.clearAllMocks();

      await clearAllItems(region, tableName);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith({ region });
      expect(scan).toHaveBeenCalledTimes(1);
      expect(scan).toHaveBeenCalledWith({ TableName: tableName });
      expect(dbDelete).toHaveBeenCalledTimes(0);
    });

    test('should call delete on non empty db', async () => {
      const scan = db().scan;
      const dbDelete = db().delete;
      const promise = scan().promise;
      const items = [{ id: 'id1' }, { id: 'id2' }];
      promise.mockReturnValue(Promise.resolve({ Items: items }));

      jest.clearAllMocks();

      await clearAllItems(region, tableName);

      expect(dbDelete).toHaveBeenCalledTimes(items.length);

      items.forEach(item => {
        expect(dbDelete).toHaveBeenCalledWith({
          Key: { id: item.id },
          TableName: tableName,
        });
      });
    });
  });

  describe('getItem', () => {
    test('should return item', async () => {
      const get = db().get;
      const promise = get().promise;
      const item = { Item: { id: 'id' } };
      promise.mockReturnValue(Promise.resolve(item));

      jest.clearAllMocks();

      const key = { id: 'id' };
      const actual = await getItem(region, tableName, key);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith({ region });
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith({ TableName: tableName, Key: key });
      expect(actual).toEqual(item.Item);
    });
  });
});
