#!/usr/bin/env bash

NODE_ENV=production npm run build

if [ "${TRAVIS_BRANCH}" = "master" ]; then
    echo "PUSHING ci-beta"
    rm -rf dist/.git
    .travis/release.sh "ci-beta"

    echo "PUSHING qa-beta"
    rm -rf dist/.git
    .travis/release.sh "qa-beta"
elif [ "${TRAVIS_BRANCH}" = "master-stable" ]; then
    echo "PUSHING ci-stable"
    rm -rf dist/.git
    .travis/release.sh "ci-stable"
    
    echo "PUSHING qa-stable"
    rm -rf dist/.git
    .travis/release.sh "qa-stable"
elif [[ "${TRAVIS_BRANCH}" = "prod-beta" || "${TRAVIS_BRANCH}" = "prod-stable" ]]; then
    .travis/release.sh "${TRAVIS_BRANCH}"
fi
