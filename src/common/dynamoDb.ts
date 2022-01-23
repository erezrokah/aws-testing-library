import filterObject = require('filter-obj');
import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { ICommonProps } from './';

export interface IDynamoDbProps extends ICommonProps {
  table: string;
}

export const expectedProps = ['region', 'table', 'key'];

export const removeKeysFromItemForNonStrictComparison = (
  received: AttributeMap,
  expected: AttributeMap,
) => {
  return filterObject(received, (key) =>
    Object.prototype.hasOwnProperty.call(expected, key),
  );
};
