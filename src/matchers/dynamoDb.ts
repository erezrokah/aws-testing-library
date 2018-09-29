import { AttributeMap, Key } from 'aws-sdk/clients/dynamodb';
import diff = require('jest-diff');
import { EOL } from 'os';
import { getItem } from '../utils/dynamoDb';
import { ICommon, verifyProps } from './common';

interface IDbProps extends ICommon {
  tableName: string;
}

const expectedProps = ['region', 'tableName', 'key'];

export const toHaveItem = async function(
  this: jest.MatcherUtils,
  props: IDbProps,
  key: Key,
  expected?: AttributeMap,
) {
  verifyProps({ ...props, key }, expectedProps);

  const { region, tableName } = props;

  try {
    const printTable = this.utils.printExpected(tableName);
    const printRegion = this.utils.printExpected(region);
    const printKey = this.utils.printExpected(key) + EOL;

    const notHint = this.utils.matcherHint('.not.toHaveItem') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveItem') + EOL + EOL;

    const received = await getItem(region, tableName, key);
    // check if item was found
    if (received) {
      // no expected item to compare with
      if (!expected) {
        return {
          message: () =>
            `${notHint}Expected ${printTable} at region ${printRegion} not to have item with key ${printKey}`,
          pass: true,
        };
      } else {
        // we check equality as well
        const pass = this.equals(expected, received);

        const printReceived = this.utils.printReceived(received);
        const printExpected = this.utils.printExpected(expected);

        if (pass) {
          return {
            message: () =>
              `${notHint}Expected item ${printReceived} not to equal ${printExpected}`,
            pass: true,
          };
        } else {
          const diffString = diff(expected, received, {
            expand: true,
          });
          return {
            message: () =>
              `${hint}Expected item ${printReceived} to equal ${printExpected}${EOL}` +
              `Difference:${diffString ? `${EOL}${EOL}${diffString}` : ''}`,
            pass: false,
          };
        }
      }
    } else {
      // no item was found
      return {
        message: () =>
          `${hint}Expected ${printTable} at region ${printRegion} to have item with key ${printKey}`,
        pass: false,
      };
    }
  } catch (e) {
    // unknown error
    console.error(`Unknown error while looking for item: ${e.message}`);
    throw e;
  }
};
