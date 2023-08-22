/** @type import('@redhat-cloud-services/frontend-components-config/lib/fec.config').FECConfiguration */
module.exports = {
  appUrl: '/settings/sources',
  useProxy: true,
  proxyVerbose: true,
  /**
   * Change to false after your app is registered in configuration files
   */
  interceptChromeConfig: false,
  /**
   * Add additional webpack plugins
   */
  plugins: [],
  moduleFederation: {
    exclude: ['react-router-dom', "@patternfly/react-core", "@patternfly/react-icons"],
    shared: [
      { 'react-router-dom': { singleton: true, version: '^6.8.0' } },
    ],
  },
  hotReload: process.env.HOT === 'true',
};
