import { removeKeysFromItemForNonStrictComparison } from './dynamoDb';

describe('common dynamoDb', () => {
  test('removeKeysFromItemForNonStrictComparison should remove keys not in expected', () => {
    const received = {
      name: { S: 'hello' },
      date: { S: new Date().toISOString() },
    };
    const expected = {
      name: { S: 'hello' },
    };

    const removed = removeKeysFromItemForNonStrictComparison(
      received,
      expected,
    );
    expect(removed).toEqual({
      name: { S: 'hello' },
    });
  });
});
