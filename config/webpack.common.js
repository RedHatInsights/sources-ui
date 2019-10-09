/* global require, module, __dirname */

const path = require('path');
const GitRevisionPlugin = require('git-revision-webpack-plugin');
const gitRevisionPlugin = new GitRevisionPlugin({
    branch: true
});
const entry = process.env.NODE_ENV === 'production' ?
    path.resolve(__dirname, '../src/entry.js') :
    path.resolve(__dirname, '../src/entry-dev.js');
const { insights } = require('../package.json');

let deploymentEnv = 'apps';
if (process.env.BETA === 'true') {
    deploymentEnv = 'beta/apps';
}

const gitBranch = process.env.TRAVIS_BRANCH || process.env.BRANCH || gitRevisionPlugin.branch();
const betaBranch =
    gitBranch === 'master' ||
    gitBranch === 'ci-beta' ||
    gitBranch === 'qa-beta' ||
    gitBranch === 'prod-beta';
if (process.env.NODE_ENV === 'production' && betaBranch) {
    deploymentEnv = 'beta/apps';
}

const publicPath = `/${deploymentEnv}/${insights.appname}/`;

module.exports = {
    paths: {
        entry,
        public: path.resolve(__dirname, '../dist'),
        src: path.resolve(__dirname, '../src'),
        presentationalComponents: path.resolve(__dirname, '../src/PresentationalComponents'),
        smartComponents: path.resolve(__dirname, '../src/SmartComponents'),
        pages: path.resolve(__dirname, '../src/pages'),
        components: path.resolve(__dirname, '../src/components'),
        static: path.resolve(__dirname, '../static'),
        publicPath
    },
    deploymentEnv
};
