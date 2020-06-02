/* global require, module, __dirname */

const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.common.js');

const plugins = [
    new(require('write-file-webpack-plugin'))(),
    new(require('html-webpack-plugin'))({
        title: 'Sources',
        filename: 'index.html',
        template: path.resolve(__dirname, '../src/index.html')
    }),
    new webpack.SourceMapDevToolPlugin({
        test: /\.js/i,
        exclude: /(node_modules)/i,
        filename: `sourcemaps/[name].js.map`
    }),
    new webpack.DefinePlugin({
        'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/api'),
    }),
    new(require('html-replace-webpack-plugin'))([{
        pattern: '@@env',
        replacement: config.deploymentEnv
    }]),
    new(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
];

module.exports = { plugins };
