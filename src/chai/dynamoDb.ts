import { Key } from 'aws-sdk/clients/dynamodb';
import { verifyProps } from '../common';
import { expectedProps, IDynamoDbProps } from '../common/dynamoDb';
import { getItem } from '../utils/dynamoDb';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      item: (key: Key) => Assertion;
    }
  }
}

const dynamoDb = (chai: any) => {
  chai.Assertion.addMethod('item', async function(this: any, key: Key) {
    const props = this._obj as IDynamoDbProps;
    verifyProps({ ...props, key }, expectedProps);

    const { region, table } = props;
    const received = await getItem(region, table, key);

    const printKey = JSON.stringify(key);
    this.assert(
      !!received,
      `expected ${table} to have item with key ${printKey}`,
      `expected ${table} not to have item with key ${printKey}`,
    );
  });
};

export default dynamoDb;
