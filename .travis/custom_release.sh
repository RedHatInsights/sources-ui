#!/usr/bin/env bash

NODE_ENV=production npm run build

# If current dev branch is master, push to build repo ci-stable
if [ "${TRAVIS_BRANCH}" = "master" ]; then
    .travis/release.sh "ci-stable"
fi

# If current dev branch is deployment branch, push to build repo
if [[ "${TRAVIS_BRANCH}" = "ci-beta"  || "${TRAVIS_BRANCH}" = "qa-beta" || "${TRAVIS_BRANCH}" = "qa-stable" || "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
