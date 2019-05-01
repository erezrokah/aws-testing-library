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
  // remove keys that are in received, but not in expected
  Object.keys(received).forEach(actualKey => {
    if (!expected.hasOwnProperty(actualKey)) {
      /* istanbul ignore next */
      const { [actualKey]: omit, ...rest } = received;
      received = rest;
    }
  });
  return received;
};
