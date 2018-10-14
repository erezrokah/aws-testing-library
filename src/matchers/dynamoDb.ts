import { AttributeMap, Key } from 'aws-sdk/clients/dynamodb';
import diff = require('jest-diff');
import { EOL } from 'os';
import { getItem } from '../utils/dynamoDb';
import { ICommonProps, verifyProps } from './common';

interface IDbProps extends ICommonProps {
  table: string;
}

const expectedProps = ['region', 'table', 'key'];

export const toHaveItem = async function(
  this: jest.MatcherUtils,
  props: IDbProps,
  key: Key,
  expected?: AttributeMap,
  strict: boolean = true,
) {
  verifyProps({ ...props, key }, expectedProps);

  const { region, table } = props;

  try {
    const printTable = this.utils.printExpected(table);
    const printRegion = this.utils.printExpected(region);
    const printKey = this.utils.printExpected(key) + EOL;

    const notHint = this.utils.matcherHint('.not.toHaveItem') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveItem') + EOL + EOL;

    let received = await getItem(region, table, key);
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
        if (!strict) {
          // remove keys that are in actual, but not in expected
          Object.keys(received).forEach(actualKey => {
            if (!expected.hasOwnProperty(actualKey)) {
              /* istanbul ignore next */
              const { [actualKey]: omit, ...rest } = received as AttributeMap;
              received = rest;
            }
          });
        }
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
