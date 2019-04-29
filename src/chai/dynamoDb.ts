import { AttributeMap, Key } from 'aws-sdk/clients/dynamodb';
import { verifyProps } from '../common';
import {
  expectedProps,
  IDynamoDbProps,
  removeKeysFromItemForNonStrictComparison,
} from '../common/dynamoDb';
import { getItem } from '../utils/dynamoDb';

declare global {
  namespace Chai {
    // tslint:disable-next-line:interface-name
    interface Assertion {
      item: (key: Key, expected?: AttributeMap, strict?: boolean) => Assertion;
    }
  }
}

const dynamoDb = (chai: any) => {
  chai.Assertion.addMethod('item', async function(
    this: any,
    key: Key,
    expected?: AttributeMap,
    strict: boolean = true,
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
      const { negate } = this.__flags;
      if (negate) {
        new chai.Assertion(expected).to.not.deep.equal(received);
      } else {
        new chai.Assertion(expected).to.deep.equal(received);
      }
    } else {
      // only check existence
      this.assert(
        !!received,
        `expected ${table} to have item with key ${printKey}`,
        `expected ${table} not to have item with key ${printKey}`,
      );
    }
  });
};

export default dynamoDb;
