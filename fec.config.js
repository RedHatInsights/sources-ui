const path = require('path');

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
    exposes: {
      './RootApp': path.resolve(__dirname, './src/AppEntry.js'),
      './IntegrationsWidget': path.resolve(__dirname, './src/components/Widget/IntegrationsWidget'),
    },
    exclude: ['react-router-dom'],
    shared: [{ 'react-router-dom': { singleton: true, version: '^6.8.0' } }],
  },
  hotReload: process.env.HOT === 'true',
  routes: {
    ...(process.env.LOCAL_NOTIFICATIONS && {
      '/beta/apps/notifications': {
        host: `http://localhost:8003`,
      },
      '/apps/notifications': {
        host: `http://localhost:8003`,
      },
    }),
    ...(process.env.CONFIG_PORT && {
      '/api/chrome-service/v1/static': {
        host: `http://localhost:${process.env.CONFIG_PORT}`,
      },
      '/api/chrome-service/v1/dashboard-templates': {
        host: `http://localhost:${process.env.CONFIG_PORT}`,
      },
    }),
  },
};
