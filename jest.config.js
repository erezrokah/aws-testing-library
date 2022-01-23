/* eslint-env node */
const esModules = ['filter-obj'].join('|');

module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest/presets/js-with-ts',
  testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$',
  transformIgnorePatterns: [`node_modules/(?!${esModules})`],
};
