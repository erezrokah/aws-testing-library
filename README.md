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

The simplest setup is to use jest's `setupTestFrameworkScriptFile` config.

Make sure your `package.json` includes the following:

```json
// package.json
"jest": {
  "setupTestFrameworkScriptFile": "./node_modules/jest-e2e-serverless/lib/index.js",
},
```

#### Usage with TypeScript

When using `jest-e2e-serverless` with [TypeScript](http://typescriptlang.org/) and [ts-jest](https://github.com/kulshekhar/ts-jest), you'll need to add a `setupFrameworks.ts` file to your app that explicitly imports `jest-e2e-serverless`, and point the `setupTestFrameworkScriptFile` field in your `package.json` file towards it:

```typescript
// src/setupFrameworks.ts
import 'jest-e2e-serverless';
```

```json
// package.json
"jest": {
 "setupTestFrameworkScriptFile": "./src/setupFrameworks.ts",
},
```
