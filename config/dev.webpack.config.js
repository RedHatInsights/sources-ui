const { resolve } = require('path');
const config = require('@redhat-cloud-services/frontend-components-config');
const ExtensionsPlugin = require('@redhat-cloud-services/frontend-components-config-utilities/extensions-plugin');
const { config: webpackConfig, plugins } = config({
  rootFolder: resolve(__dirname, '../'),
  debug: true,
  useFileHash: false,
  deployment: process.env.BETA ? 'beta/apps' : 'apps',
  useProxy: true,
  appUrl: process.env.BETA ? '/beta/settings/sources' : '/settings/sources',
  env: process.env.BETA ? 'stage-beta' : 'stage-stable',
  useChromeTemplate: true,
  //localChrome: process.env.INSIGHTS_CHROME,
  //proxyVerbose: true,
});

plugins.push(
  require('@redhat-cloud-services/frontend-components-config/federated-modules')({
    root: resolve(__dirname, '../'),
    useFileHash: false,
    exposes: {
      './RootApp': resolve(__dirname, '../src/DevEntry'),
      './RecommendedServices': resolve(__dirname, '../src/marketplace/RecommendedServices.js'),
    },
  }),
  new ExtensionsPlugin(
    {
      extensions: [
        {
          type: 'console.page/route',
          properties: {
            path: '/marketplace',
            component: {
              $codeRef: 'RecommendedServices',
            },
          },
        },
      ],
    },
    {
      exposes: {
        RecommendedServices: resolve(__dirname, '../src/marketplace/RecommendedServices.js'),
      },
    }
  )
);

module.exports = {
  ...webpackConfig,
  plugins,
};
