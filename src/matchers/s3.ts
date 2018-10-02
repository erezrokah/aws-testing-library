import diff = require('jest-diff');
import { EOL } from 'os';
import { getObject } from '../utils/s3';
import { ICommonProps, verifyProps } from './common';

interface IS3Props extends ICommonProps {
  bucket: string;
}

const expectedProps = ['region', 'bucket', 'key'];

export const toHaveObject = async function(
  this: jest.MatcherUtils,
  props: IS3Props,
  key: string,
  expected?: Buffer,
) {
  verifyProps({ ...props, key }, expectedProps);

  const { region, bucket } = props;

  try {
    const printBucket = this.utils.printExpected(bucket);
    const printRegion = this.utils.printExpected(region);
    const printKey = this.utils.printExpected(key) + EOL;

    const notHint = this.utils.matcherHint('.not.toHaveObject') + EOL + EOL;
    const hint = this.utils.matcherHint('.toHaveObject') + EOL + EOL;

    const { body: received, found } = await getObject(region, bucket, key);
    // check if object was found
    if (found) {
      // no expected buffer to compare with
      if (!expected) {
        return {
          message: () =>
            `${notHint}Expected ${printBucket} at region ${printRegion} not to have object with key ${printKey}`,
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
              `${notHint}Expected object ${printReceived} not to equal ${printExpected}`,
            pass: true,
          };
        } else {
          const diffString = diff(expected, received, {
            expand: true,
          });
          return {
            message: () =>
              `${hint}Expected object ${printReceived} to equal ${printExpected}${EOL}` +
              `Difference:${diffString ? `${EOL}${EOL}${diffString}` : ''}`,
            pass: false,
          };
        }
      }
    } else {
      // no item was found
      return {
        message: () =>
          `${hint}Expected ${printBucket} at region ${printRegion} to have object with key ${printKey}`,
        pass: false,
      };
    }
  } catch (e) {
    // unknown error
    console.error(`Unknown error while looking for object: ${e.message}`);
    throw e;
  }
};
