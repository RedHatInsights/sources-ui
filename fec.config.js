module.exports = {
  appUrl: '/settings/integrations',
  debug: true,
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
    exclude: ['react-router-dom'],
    shared: [{ 'react-router-dom': { singleton: true, version: '^6.8.0' } }],
  },
  hotReload: process.env.HOT === 'true',
};
