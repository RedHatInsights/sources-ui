import { SOURCES_API_BASE } from '../Utilities/Constants';
import { sourcesViewDefinition } from '../views/sourcesViewDefinition';
import find from 'lodash/find';

/*global require*/
let TopologicalInventory = require('@manageiq/topological_inventory');

let apiInstance;

export function getApiInstance() {
    if (apiInstance) {
        return apiInstance;
    }

    apiInstance = new TopologicalInventory.DefaultApi();
    let defaultClient = TopologicalInventory.ApiClient.instance;
    defaultClient.basePath = SOURCES_API_BASE;
    return apiInstance;
}

export function getEntities (_pagination, _filter) {
    return fetch(SOURCES_API_BASE + sourcesViewDefinition.url).then(r => {
        if (r.ok || r.type === 'opaque') {
            return r.json();
        }

        throw new Error(`Unexpected response code ${r.status}`);
    });
}

export function doRemoveSource(sourceId) {
    return getApiInstance().deleteSource(sourceId).then((sourceDataOut) => {
        console.log('API call deleteSource returned data: ', sourceDataOut);
    }, (_error) => {
        console.error('Source removal failed.');
        throw { error: 'Source removal failed.' };
    });
}

export function doLoadSourceForEdit(sourceId) {
    return getApiInstance().showSource(sourceId).then(sourceData => {
        console.log('API call showSource returned: ', sourceData);

        return getApiInstance().listSourceEndpoints(sourceId, {}).then(endpoints => {
            console.log('API call listSourceEndpoints returned: ', endpoints);

            // we take just the first endpoint
            const endpoint = endpoints && endpoints.data && endpoints.data[0];

            if (!endpoint) { // bail out
                return sourceData;
            }

            sourceData.endpoint = endpoint;

            return getApiInstance().listEndpointAuthentications(endpoint.id, {}).then(authentications => {
                console.log('API call listEndpointAuthentications returned: ', authentications);

                // we take just the first authentication
                const authentication = authentications && authentications.data && authentications.data[0];

                if (authentication) {
                    sourceData.authentication = authentication;
                }

                return sourceData;
            });
        });
    });
}

const parseUrl = url => {
    if (!url) {
        return ({});
    }

    try {
        const u = new URL(url);
        return {
            scheme: u.protocol.replace(/:$/, ''),
            host: u.hostname,
            port: u.port,
            path: u.pathname
        };
    } catch (error) {
        console.log(error);
        return ({});
    }
};

/*
 * If there's an URL in the formData, parse it and use it,
 * else use individual fields (scheme, host, port, path).
 */
const urlOrHost = formData => formData.url ? parseUrl(formData.url) : formData;

export function doCreateSource(formData, sourceTypes) {
    let sourceData = {
        tenant_id: 1, /* FIXME: remove this */
        name: formData.source_name,
        source_type_id: find(sourceTypes, { name: formData.source_type }).id
    };

    return getApiInstance().createSource(sourceData).then((sourceDataOut) => {
        const { scheme, host, port, path } = urlOrHost(formData);

        const endpointData = {
            source_id: parseInt(sourceDataOut.id, 10),
            tenant_id: parseInt(sourceDataOut.tenant_id, 10),
            role: formData.role,
            scheme,
            host,
            port: parseInt(port, 10),
            path,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        return getApiInstance().createEndpoint(endpointData).then((endpointDataOut) => {
            const authenticationData = {
                resource_id: parseInt(endpointDataOut.id, 10),
                resource_type: 'Endpoint',
                tenant_id: parseInt(sourceDataOut.tenant_id, 10),
                password: formData.token || formData.password
            };

            return getApiInstance().createAuthentication(authenticationData).then((authenticationDataOut) => {
                return authenticationDataOut;
            }, (_error) => {
                console.error('Authentication creation failure.');
                throw { error: 'Authentication creation failure.' };
            });
        }, (_error) => {
            console.error('Endpoint creation failure.');
            throw { error: 'Endpoint creation failure.' };
        });

    }, (_error) => {
        console.error('Source creation failure.');
        throw { error: 'Source creation failure.' };
    });
}

export function doUpdateSource(source, formData) {
    const inst = getApiInstance();

    let sourceData = {
        name: formData.source_name
    };

    return inst.updateSource(source.id, sourceData)
    .then((_sourceDataOut) => {
        const { scheme, host, port, path } = urlOrHost(formData);

        const endpointData = {
            scheme,
            host,
            port: parseInt(port, 10),
            path,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        return inst.updateEndpoint(source.endpoint.id, endpointData)
        .then((_endpointDataOut) => {
            const authenticationData = {
                // FIXME: missing USER here?
                password: formData.token || formData.password // FIXME: unify
            };

            return inst.updateAuthentication(source.authentication.id, authenticationData)
            .then((authenticationDataOut) => {
                return authenticationDataOut;
            }, (_error) => {
                console.error('Authentication update failure.');
                throw { error: 'Authentication update failure.' };
            });
        }, (_error) => {
            console.error('Endpoint update failure.');
            throw { error: 'Endpoint update failure.' };
        });

    }, (_error) => {
        console.error('Source update failure.');
        throw { error: 'Source update failure.' };
    });
}
