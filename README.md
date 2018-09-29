# jest-e2e-serverless

## Installation

We suggest using [yarn](https://github.com/yarnpkg/yarn) for installations.

```bash
yarn add jest-e2e-serverless --dev
```

But npm works too!

```bash
npm install jest-e2e-serverless --save-dev
```

### Setup

The simplest setup is to use jest's `setupTestFrameworkScriptFile` config.

Make sure your `package.json` includes the following:

```js
"jest": {
  "setupTestFrameworkScriptFile": "./node_modules/jest-e2e-serverless/lib/index.js",
},
```

#### Usage with TypeScript

When using jest-enzyme with [TypeScript](http://typescriptlang.org/) and [ts-jest](https://github.com/kulshekhar/ts-jest), you'll need to add a `setupTests.ts` file to your app that explicitly imports jest-enzyme, and point the `setupTestFrameworkScriptFile` field in your `package.json` file towards it:

```typescript
// src/setupFrameworks.ts
import 'jest-e2e-serverless';
```

```js
"jest": {
 "setupTestFrameworkScriptFile": "./src/setupFrameworks.ts",
},
```
