const localhost = 'localhost';

module.exports = {
  routes: {
    '/settings/sources': { host: `http://${localhost}:8002` },
    '/beta/apps/sources': { host: `http://${localhost}:8002` },
    '/apps/sources': { host: `http://${localhost}:8002` },
  },
};
