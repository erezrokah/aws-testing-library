import { AttributeMap } from 'aws-sdk/clients/dynamodb';
import { ICommonProps } from './';

export interface IDynamoDbProps extends ICommonProps {
  table: string;
}

export const expectedProps = ['region', 'table', 'key'];

type predicate =  (key: any, value: any, object: any) => boolean | Array<any>

const filterObject = (
  object: AttributeMap,
  predicate: predicate,
) => {
  const result = {};
  const isArray = Array.isArray(predicate);

  for (const [key, value] of Object.entries(object)) {
    if (isArray ? predicate.includes(key) : predicate(key, value, object)) {
      Object.defineProperty(result, key, {
        value,
        writable: true,
        enumerable: true,
        configurable: true,
      });
    }
  }

  return result;
};

export const removeKeysFromItemForNonStrictComparison = (
  received: AttributeMap,
  expected: AttributeMap,
) => {
  return filterObject(received, (key) =>
    Object.prototype.hasOwnProperty.call(expected, key),
  );
};
