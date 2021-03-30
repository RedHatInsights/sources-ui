# Sources
![Main screen with "Add a new Source" wizard](doc/images/sources-main-add.png)

[![Build Status](https://travis-ci.com/RedHatInsights/sources-ui.svg?branch=master)](https://travis-ci.com/RedHatInsights/sources-ui)
[![Test Coverage](https://codecov.io/gh/RedHatInsights/sources-ui/branch/master/graph/badge.svg)](https://codecov.io/gh/RedHatInsights/sources-ui)

List of Sources for Red Hat Cloud Services.

This application allows to
- view all sources (filtering, sorting)
- add a new source
- connect an application to a source
- remove an application from a source

**Table of Contents**
- [Sources](#sources)
- [Getting Started](#getting-started)
  - [Run app](#run-app)
  - [Debug functions](#debug-functions)
- [Testing](#testing)
- [Patternfly](#patternfly)
- [Data-driven forms](#data-driven-forms)
- [Insights Components](#insights-components)
  - [AddSourceWizard](#addsourcewizard)
  - [Updating steps in the wizard](#updating-steps-in-the-wizard)
- [API](#api)
  - [Sources Javascript API client](#sources-javascript-api-client)
- [Insights Frontend Assets](#insights-frontend-assets)
- [Deploying](#deploying)
  - [How it works](#how-it-works)
- [License](#license)

# Getting Started
## Run app

1. ```npm install```

2.  ```npm run start```
    - starts webpack bundler and serves the files with webpack dev server on `https://ci.foo.redhat.com:1337/settings/sources/`

2.  ```npm run start:beta```
    - starts webpack bundler and serves the files with webpack dev server on `https://ci.foo.redhat.com:1337/beta/settings/sources/`

You have to be connected to Red Hat VPN.

Check our [proxy documenation](https://github.com/RedHatInsights/frontend-components/tree/master/packages/config#useproxy) for more options.

## Debug functions

Sources UI provides easy way how to test different states of the application when running in dev environment.

Run from the console one of following commands:

- ```sourcesDebug.showEmptyState```

Sets number of currently loaded sources to 0. Shows empty state.

- ```sourcesDebug.setCount```

Changes number of sources to a value you need.

- ```sourcesDebug.removePermissions```

Removes write permissions.

- ```sourcesDebug.setPermissions```

Grants write permissions.

# Testing

- Travis is used to test the build for this code.
  - `npm run test` will run tests,
  - `npm run lint` will run just the linter.

# Patternfly

- This project imports Patternfly components:
  - [Patternfly React](https://github.com/patternfly/patternfly-react)

# Data-driven forms

- This project uses Data-driven forms:
  - [Data-driven Forms](https://github.com/data-driven-forms)
  - [Data-driven Demo](http://data-driven-forms.org/)

# Insights Components

[Red Hat Insights Frontend Components](https://github.com/RedHatInsights/frontend-components)

Insights Platform will deliver components and static assets through [npm](https://www.npmjs.com/package/@redhat-cloud-services/frontend-components). ESI tags are used to import the [chroming](https://github.com/RedHatInsights/insights-chrome) which takes care of the header, sidebar, and footer.

## AddSourceWizard

**ADD SOURCE WIZARD WAS MOVED TO THIS REPOSITORY!**

Documentation is [here](doc/wizard.md).

## Updating steps in the wizard

- See [Update wizard](doc/update-wizard.md). This guideline provides info how to update the add source wizard.

# API

- [Sources API](https://github.com/RedHatInsights/sources-api)

## Sources Javascript API client

This API client is no longer in the UI because of its huge bundle size. However, is useful to use is a documentation to the API.

- [Sources API Javascript client](https://github.com/RedHatInsights/javascript-clients/blob/master/packages/sources/doc/README.md)

# Insights Frontend Assets

Static assets are deployed to [Insights Frontend Assets](https://github.com/RedHatInsights/insights-frontend-assets) repository. If you need to add/change/remove some icon, please do it there.

# Deploying

- The Platform team is using Travis to deploy the application

## How it works

- any push to the `{REPO}` `master` branch will deploy to a `{REPO}-build` `master` branch
- any push to a `{REPO}` `stable/\*` branch will deploy to a `{REPO}-build` `stable` branch
- Pull requests (based on master) will not be pushed to `{REPO}-build` `master` branch
  - If the PR is accepted and merged, master will be rebuilt and will deploy to `{REPO}-build` `master` branch

# License

This project is available as open source under the terms of the [Apache License 2.0](http://www.apache.org/licenses/LICENSE-2.0).
