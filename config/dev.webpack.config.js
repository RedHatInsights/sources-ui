const webpackConfig = require('./base.webpack.config');
const config = require('./webpack.common.js');

webpackConfig.devServer = {
  port: 8002,
  contentBase: config.paths.public,
  historyApiFallback: true,
};

module.exports = {
  ...webpackConfig,
  ...require('./dev.webpack.plugins.js'),
};
