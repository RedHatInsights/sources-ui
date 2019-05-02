
# Sources

List of sources miniapp for Insights.

:![Main screen with "Add a new Source" modal](https://raw.githubusercontent.com/martinpovolny/topological_inventory-ui/master/doc/images/sources-main-add.jpg)

Includes fragments for the Sources UI for Insights.

[![Build Status](https://travis-ci.org/ManageIQ/sources-ui.svg?branch=master)](https://travis-ci.org/ManageIQ/sources-ui)
[![Maintainability](https://api.codeclimate.com/v1/badges/039360fc91bcfa8b5232/maintainability)](https://codeclimate.com/github/ManageIQ/sources-ui/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/039360fc91bcfa8b5232/test_coverage)](https://codeclimate.com/github/ManageIQ/sources-ui/test_coverage)


## Getting Started

There is a [comprehensive quick start guide in the Storybook Documentation](https://github.com/RedHatInsights/insights-frontend-storybook/blob/master/src/docs/welcome/quickStart/DOC.md) to setting up an Insights environment complete with:

- Insights Frontend Starter App

- [Insights Chroming](https://github.com/RedHatInsights/insights-chrome)
- [Insights Proxy](https://github.com/RedHatInsights/insights-proxy)

Note: You will need to set up the Insights environment if you want to develop
with the starter app due to the consumption of the chroming service as well as
setting up your global/app navigation through the API.

## Running locally
Have [insights-proxy](https://github.com/RedHatInsights/insights-proxy) installed under PROXY_PATH

```shell
SPANDX_CONFIG="./config/spandx.config.js" bash $PROXY_PATH/scripts/run.sh
```


## Build app

1. ```npm install```

2. ```npm run start```
    - starts webpack bundler and serves the files with webpack dev server

### Testing

- Travis is used to test the build for this code.
  - `npm run test` will run tests,
  - `npx eslint src` will run just the linter.

## Deploying

- The Platform team is using Travis to deploy the application

### How it works

- any push to the `{REPO}` `master` branch will deploy to a `{REPO}-build` `master` branch
- any push to a `{REPO}` `stable/\*` branch will deploy to a `{REPO}-build` `stable` branch
- Pull requests (based on master) will not be pushed to `{REPO}-build` `master` branch
  - If the PR is accepted and merged, master will be rebuilt and will deploy to `{REPO}-build` `master` branch

## Patternfly

- This project imports Patternfly components:
  - [Patternfly React](https://github.com/patternfly/patternfly-react)

## Data-driven forms

- This project uses Data-driven forms:
  - [Data-driven Forms](https://github.com/data-driven-forms)
  - [Data-driven Demo](http://data-driven-forms.surge.sh/)

## Insights Components

Insights Platform will deliver components and static assets through [npm](https://www.npmjs.com/package/@red-hat-insights/insights-frontend-components). ESI tags are used to import the [chroming](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.

## Topological Inventory Javascript API client

- [Topological Inventory API javascript client](https://github.com/ManageIQ/topological_inventory-api-jsclient)


## Technologies

- See [Technologies](doc/technologies.md).

## License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
