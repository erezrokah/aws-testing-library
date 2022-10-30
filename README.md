# AWS Testing Library

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build](https://github.com/erezrokah/aws-testing-library/workflows/AWS%20Testing%20Library%20CI/badge.svg)](https://github.com/erezrokah/aws-testing-library/actions)
[![Coverage Status](https://coveralls.io/repos/github/erezrokah/aws-testing-library/badge.svg?branch=main)](https://coveralls.io/github/erezrokah/aws-testing-library?branch=main)

> Note: If you're missing any capability please open an issue/feature request :)

## Prerequisites

You should have your aws credentials under `~/.aws/credentials` (if you have [aws cli](https://aws.amazon.com/cli/) installed and configured).

> Note: aws credentials are loaded automatically as described [here](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)

If you plan to use the [deploy](src/utils/README.md#deploy) utility function please install and configure [serverless](https://serverless.com/framework/docs/getting-started/).

[node](https://nodejs.org/en/) >= 16.10.0.

## Installation

Install with [npm](https://www.npmjs.com/)

```bash
npm install aws-testing-library --save-dev
```

or [yarn](https://github.com/yarnpkg/yarn)

```bash
yarn add aws-testing-library --dev
```

## Usage

- [Chai](src/chai/README.md)
- [Jest](src/jest/README.md)
- [Utils](src/utils/README.md)
