/*global module, process*/

// Hack so that Mac OSX docker can sub in host.docker.internal instead of localhost
// see https://docs.docker.com/docker-for-mac/networking/#i-want-to-connect-from-a-container-to-a-service-on-the-host
const localhost = (process.env.PLATFORM === 'linux') ? 'localhost' : 'host.docker.internal';

module.exports = {
    routes: {
        '/insights/settings/sources': { host: `http://${localhost}:8002` },
        '/hybrid/settings/sources': { host: `http://${localhost}:8002` },

        //'/hybrid/settings/catalog-sources': { host: `http://${localhost}:8002` },
        //'/hybrid/settings/cost-management-sources': { host: `http://${localhost}:8002` },
        '/apps/sources': { host: `http://${localhost}:8002` }
        // '/apps/chrome': { host: 'https://ci.cloud.paas.upshift.redhat.com' } // use non-local chrome
    }
};
