import AWS = require('aws-sdk');

export const clearAllItems = async (region: string, tableName: string) => {
  const db = new AWS.DynamoDB.DocumentClient({ region });
  const scanResult = await db.scan({ TableName: tableName }).promise();
  const items = scanResult.Items || [];
  await Promise.all(
    items.map(item =>
      db.delete({ TableName: tableName, Key: { id: item.id } }).promise(),
    ),
  );
};

export const getItem = async (
  region: string,
  tableName: string,
  key: AWS.DynamoDB.DocumentClient.Key,
) => {
  const db = new AWS.DynamoDB.DocumentClient({ region });
  const dbItem = await db.get({ TableName: tableName, Key: key }).promise();
  // Item is undefined if key not found
  return dbItem.Item;
};
