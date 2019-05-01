import { verifyProps } from '../common';
import {
  expectedProps,
  IDynamoDbProps,
  removeKeysFromItemForNonStrictComparison,
} from '../common/dynamoDb';
import { getItem } from '../utils/dynamoDb';
import { wrapWithRetries } from './utils';

const attemptDynamoDb = async function(
  this: any,
  eql: any,
  objDisplay: any,
  key: AWS.DynamoDB.DocumentClient.Key,
  expected: AWS.DynamoDB.DocumentClient.AttributeMap,
  strict: boolean,
) {
  const props = this._obj as IDynamoDbProps;
  verifyProps({ ...props, key }, expectedProps);

  const { region, table } = props;
  let received = await getItem(region, table, key);

  const printKey = JSON.stringify(key);

  if (received && expected) {
    // check equality as well
    if (!strict) {
      received = removeKeysFromItemForNonStrictComparison(received, expected);
    }
    const deepEquals = eql(expected, received);
    return {
      message: `expected ${objDisplay(expected)} to be equal to ${objDisplay(
        received,
      )}`,
      negateMessage: `expected ${objDisplay(
        expected,
      )} to not be equal to ${objDisplay(received)}`,
      pass: deepEquals,
    };
  } else {
    // only check existence
    return {
      message: `expected ${table} to have item with key ${printKey}`,
      negateMessage: `expected ${table} not to have item with key ${printKey}`,
      pass: received,
    };
  }
};

const dynamoDb = (chai: any, { eql, objDisplay }: any) => {
  chai.Assertion.addMethod('item', async function(
    this: any,
    key: AWS.DynamoDB.DocumentClient.Key,
    expected?: AWS.DynamoDB.DocumentClient.AttributeMap,
    strict: boolean = true,
  ) {
    const wrapped = wrapWithRetries(attemptDynamoDb);
    const { pass, message, negateMessage } = await wrapped.apply(this, [
      eql,
      objDisplay,
      key,
      expected,
      strict,
    ]);

    this.assert(pass, message, negateMessage);
  });
};

export default dynamoDb;
