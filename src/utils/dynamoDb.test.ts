import { clearAllItems, getItem } from './dynamoDb';

jest.mock('aws-sdk', () => {
  const scanValue = { promise: jest.fn() };
  const scan = jest.fn(() => scanValue);
  const deleteValue = { promise: jest.fn() };
  const dbDelete = jest.fn(() => deleteValue);
  const getValue = { promise: jest.fn() };
  const get = jest.fn(() => getValue);
  const DocumentClient = jest.fn(() => ({ scan, delete: dbDelete, get }));
  const describeTableValue = { promise: jest.fn() };
  const describeTable = jest.fn(() => describeTableValue);
  const DynamoDB = jest.fn(() => ({ describeTable })) as any;
  DynamoDB.DocumentClient = DocumentClient;
  return { DynamoDB };
});

describe('dynamoDb utils', () => {
  const AWS = require('aws-sdk');
  const db = AWS.DynamoDB;
  const documentClient = AWS.DynamoDB.DocumentClient;

  const [region, tableName] = ['region', 'tableName'];

  describe('clearAllItems', () => {
    test('should not call delete on empty db', async () => {
      const describeTable = db().describeTable;
      const describeTablePromise = describeTable().promise;
      describeTablePromise.mockReturnValue(Promise.resolve({}));

      const scan = documentClient().scan;
      const dbDelete = documentClient().delete;
      const scanPromise = scan().promise;
      scanPromise.mockReturnValue(Promise.resolve({ Items: undefined }));

      jest.clearAllMocks();

      await clearAllItems(region, tableName);

      expect(db).toHaveBeenCalledTimes(1);
      expect(db).toHaveBeenCalledWith({ region });
      expect(describeTable).toHaveBeenCalledTimes(1);
      expect(describeTable).toHaveBeenCalledWith({
        TableName: tableName,
      });
      expect(documentClient).toHaveBeenCalledTimes(1);
      expect(documentClient).toHaveBeenCalledWith({ region });
      expect(scan).toHaveBeenCalledTimes(1);
      expect(scan).toHaveBeenCalledWith({
        AttributesToGet: [],
        TableName: tableName,
      });
      expect(dbDelete).toHaveBeenCalledTimes(0);
    });

    test('should call delete on non empty db', async () => {
      const describeTable = db().describeTable;
      const describeTablePromise = describeTable().promise;
      const table = { KeySchema: [{ AttributeName: 'id' }] };
      describeTablePromise.mockReturnValue(Promise.resolve({ Table: table }));

      const scan = documentClient().scan;
      const dbDelete = documentClient().delete;
      const scanPromise = scan().promise;
      const items = [{ id: 'id1' }, { id: 'id2' }];
      scanPromise.mockReturnValue(Promise.resolve({ Items: items }));

      jest.clearAllMocks();

      await clearAllItems(region, tableName);

      expect(scan).toHaveBeenCalledTimes(1);
      expect(scan).toHaveBeenCalledWith({
        AttributesToGet: table.KeySchema.map(k => k.AttributeName),
        TableName: tableName,
      });

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
      const get = documentClient().get;
      const promise = get().promise;
      const item = { Item: { id: 'id' } };
      promise.mockReturnValue(Promise.resolve(item));

      jest.clearAllMocks();

      const key = { id: 'id' };
      const actual = await getItem(region, tableName, key);

      expect(documentClient).toHaveBeenCalledTimes(1);
      expect(documentClient).toHaveBeenCalledWith({ region });
      expect(get).toHaveBeenCalledTimes(1);
      expect(get).toHaveBeenCalledWith({ TableName: tableName, Key: key });
      expect(actual).toEqual(item.Item);
    });
  });
});
