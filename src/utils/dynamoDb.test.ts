import { clearAllItems, getItem, writeItems } from './dynamoDb';

jest.mock('aws-sdk', () => {
  const scanValue = { promise: jest.fn() };
  const scan = jest.fn(() => scanValue);
  const batchWriteValue = { promise: jest.fn() };
  const batchWrite = jest.fn(() => batchWriteValue);
  const getValue = { promise: jest.fn() };
  const get = jest.fn(() => getValue);
  const DocumentClient = jest.fn(() => ({ scan, batchWrite, get }));
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
    test('should not call batchWrite on empty db', async () => {
      const describeTable = db().describeTable;
      const describeTablePromise = describeTable().promise;
      describeTablePromise.mockReturnValue(Promise.resolve({}));

      const scan = documentClient().scan;
      const batchWrite = documentClient().batchWrite;
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
      expect(batchWrite).toHaveBeenCalledTimes(0);
    });

    test('should call batchWrite on non empty db', async () => {
      const describeTable = db().describeTable;
      const describeTablePromise = describeTable().promise;
      const table = { KeySchema: [{ AttributeName: 'id' }] };
      describeTablePromise.mockReturnValue(Promise.resolve({ Table: table }));

      const scan = documentClient().scan;
      const batchWrite = documentClient().batchWrite;
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

      expect(batchWrite).toHaveBeenCalledTimes(1);
      expect(batchWrite).toHaveBeenCalledWith({
        RequestItems: {
          [tableName]: items.map(item => ({
            DeleteRequest: { Key: { id: item.id } },
          })),
        },
      });
    });
  });

  describe('writeItems', () => {
    test('should call batchWrite on writeItems', async () => {
      const items = [{ id: 'id1' }, { id: 'id2' }];
      const batchWrite = documentClient().batchWrite;
      const promise = batchWrite().promise;

      jest.clearAllMocks();

      await writeItems(region, tableName, items);

      const writeRequests = items.map(item => ({
        PutRequest: { Item: item },
      }));

      expect(batchWrite).toHaveBeenCalledTimes(1);
      expect(batchWrite).toHaveBeenCalledWith({
        RequestItems: { [tableName]: writeRequests },
      });
      expect(promise).toHaveBeenCalledTimes(1);
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
