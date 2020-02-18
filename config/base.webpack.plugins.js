/* global require, module, __dirname */

const path = require('path');
const webpack = require('webpack');
const config = require('./webpack.common.js');

const plugins = [
    new(require('write-file-webpack-plugin'))(),
    new(require('html-webpack-plugin'))({
        title: 'My App',
        filename: 'index.html',
        template: path.resolve(__dirname, '../src/index.html')
    }),
    new webpack.SourceMapDevToolPlugin({
        test: /\.js/i,
        exclude: /(node_modules|bower_components)/i,
        filename: `sourcemaps/[name].js.map`
    }),
    new(require('mini-css-extract-plugin'))({
        chunkFilename: 'css/[name].css',
        filename: 'css/[name].css',
        ignoreOrder: true
    }),
    new webpack.DefinePlugin({
        'process.env.BASE_PATH': JSON.stringify(process.env.BASE_PATH || '/api'),
        'process.env.FAKE_IDENTITY': JSON.stringify(process.env.FAKE_IDENTITY)
    }),
    new(require('html-replace-webpack-plugin'))([{
        pattern: '@@env',
        replacement: config.deploymentEnv
    }]),
    new webpack.HotModuleReplacementPlugin()
    //new(require('webpack-bundle-analyzer').BundleAnalyzerPlugin)
];

module.exports = { plugins };
