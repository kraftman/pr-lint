# create-node-app
[![build-url][build-url-svg]][build-url]
[![Code Coverage][coverage-badge]][coverage]

Basic node app to bootstrap new app development without having to reinstall crap

Contains:
- Code coverage + upload to codecov
- Travis pipeline
- Docker setup
- Prettier + ESLint base setup


# Design decisions:

## Testing
### No mocks in unit tests
Business logic should be decoupled enough from other modules that there's nothing to mock: code that calls other modules shouldn't contain business logic and should be tested by integration/e2e tests.

See [Mocking is a Code Smell](https://medium.com/javascript-scene/mocking-is-a-code-smell-944a70c90a6a) 
and [Test Induced Design Damage](https://enterprisecraftsmanship.com/2015/06/29/test-induced-design-damage-or-why-tdd-is-so-painful/)

### No extensive unit tests
Unit tests should be reserved for business logic, otherwise they are just testing 
that code calls other code, which is an implementation detail and will cause test refactoring whenever the implementation changes.
The goal is not 100% unit test coverage, it is 100% total test coverage


[build-url]: https://travis-ci.org/kraftman/create-node-app
[build-url-svg]: https://travis-ci.org/kraftman/create-node-app.svg?branch=master
[coverage-badge]: https://img.shields.io/codecov/c/github/kraftman/create-node-app.svg?style=flat-square
[coverage]: https://codecov.io/github/kraftman/create-node-app
