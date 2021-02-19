const localhost = 'localhost';

module.exports = {
  routes: {
    '/beta/settings/sources': { host: `http://${localhost}:8002` },
    '/settings/sources': { host: `http://${localhost}:8002` },
    '/beta/apps/sources': { host: `http://${localhost}:8002` },
    '/apps/sources': { host: `http://${localhost}:8002` },
  },
};
