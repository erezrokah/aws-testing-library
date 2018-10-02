# jest-e2e-serverless

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![CircleCI](https://circleci.com/gh/erezrokah/jest-e2e-serverless.svg?style=svg)](https://circleci.com/gh/erezrokah/jest-e2e-serverless)

## Installation

Install with [yarn](https://github.com/yarnpkg/yarn)

```bash
yarn add jest-e2e-serverless --dev
```

or [npm](https://www.npmjs.com/)

```bash
npm install jest-e2e-serverless --save-dev
```

### Setup

You'll need to add a `setupFrameworks.js` file to your app that explicitly imports `jest-e2e-serverless`, and point the `setupTestFrameworkScriptFile` field in your `package.json` file towards it:

```javascript
// src/setupFrameworks.js
require('jest-e2e-serverless');

jest.setTimeout(60000); // recommended: increase jest default timeout
```

```json
// package.json
"jest": {
 "setupTestFrameworkScriptFile": "./src/setupFrameworks.js",
},
```

#### Usage with TypeScript

When using `jest-e2e-serverless` with [TypeScript](http://typescriptlang.org/) and [ts-jest](https://github.com/kulshekhar/ts-jest), you'll need to add a `setupFrameworks.ts` file to your app that explicitly imports `jest-e2e-serverless`, and point the `setupTestFrameworkScriptFile` field in your `package.json` file towards it:

```typescript
// src/setupFrameworks.ts
import 'jest-e2e-serverless';

jest.setTimeout(60000); // recommended: increase jest default timeout
```

```json
// package.json
"jest": {
 "setupTestFrameworkScriptFile": "./src/setupFrameworks.ts",
},
```
