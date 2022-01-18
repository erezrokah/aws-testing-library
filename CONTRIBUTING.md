# Contributions

Everyone is welcome to contribute regardless of personal background. We enforce a [Code of conduct](CODE_OF_CONDUCT.md) in order to
promote a positive and inclusive environment.

## Development process

First fork and clone the repository. If you're not sure how to do this, please watch
[these videos](https://egghead.io/courses/how-to-contribute-to-an-open-source-project-on-github).

Run:

```bash
npm ci
```

Tests are run with:

```bash
npm test
```

In watch mode:

```bash
npm run test:watch
```

We use `prettier` for formatting and `eslint` for linting. You can run those using

```bash
npm run format
npm run lint
```

## Architecture

This library extends `chai` and `jest`. Wrappers for `chai` and `jest` can be found under `src/chai` and `src/jest` accordingly.
The wrappers use utilities from `src/utils` that abstract some of the complexity of dealing with AWS services APIs.

## Pull Requests

We actively welcome your pull requests.

**Before submitting a pull request,** please make sure the following is done:

1. Fork [the repository](https://github.com/erezrokah/aws-testing-library) and create your branch from `main`
2. Run `npm ci` in the repository root
3. If you fixed a bug or added code that should be tested, add tests!
4. Ensure the test suite passes (`npm test`)
5. Format your code with [prettier](https://github.com/prettier/prettier) (`npm run format`)
6. Make sure your code lints (`npm run lint`)
7. Run the [TypeScript](https://www.typescriptlang.org/) type checks (`npm run build`)
8. If applicable add an example in the [examples repository](https://github.com/erezrokah/aws-testing-library-examples)

## Releasing

Merge the release PR

## License

By contributing to AWS Testing Library, you agree that your contributions will be licensed
under its [MIT license](LICENSE).
