import AWS = require('aws-sdk');

const itemToKey = (
  item: AWS.DynamoDB.DocumentClient.AttributeMap,
  keySchema: AWS.DynamoDB.KeySchemaElement[],
) => {
  let itemKey: AWS.DynamoDB.DocumentClient.Key = {};
  keySchema.map(key => {
    itemKey = { ...itemKey, [key.AttributeName]: item[key.AttributeName] };
  });
  return itemKey;
};

export const clearAllItems = async (region: string, tableName: string) => {
  // get the table keys
  const table = new AWS.DynamoDB({ region });
  const { Table = {} } = await table
    .describeTable({ TableName: tableName })
    .promise();

  const keySchema = Table.KeySchema || [];

  // get the items to delete
  const db = new AWS.DynamoDB.DocumentClient({ region });
  const scanResult = await db
    .scan({
      AttributesToGet: keySchema.map(key => key.AttributeName),
      TableName: tableName,
    })
    .promise();
  const items = scanResult.Items || [];

  if (items.length > 0) {
    const deleteRequests = items.map(item => ({
      DeleteRequest: { Key: itemToKey(item, keySchema) },
    }));

    await db
      .batchWrite({ RequestItems: { [tableName]: deleteRequests } })
      .promise();
  }
};

export const writeItems = async (
  region: string,
  tableName: string,
  items: AWS.DynamoDB.DocumentClient.PutItemInputAttributeMap[],
) => {
  const db = new AWS.DynamoDB.DocumentClient({ region });
  const writeRequests = items.map(item => ({
    PutRequest: { Item: item },
  }));

  await db
    .batchWrite({ RequestItems: { [tableName]: writeRequests } })
    .promise();
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
