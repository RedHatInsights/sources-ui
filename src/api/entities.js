import { TOPOLOGICAL_INVENTORY_API_BASE } from '../Utilities/Constants';
import { sourcesViewDefinition } from '../views/sourcesViewDefinition';

export function getEntities () {
    return fetch(TOPOLOGICAL_INVENTORY_API_BASE + sourcesViewDefinition.url).then(r => {
        if (r.ok || r.type === 'opaque') {
            return r.json();
        }

        throw new Error(`Unexpected response code ${r.status}`);
    });
}

/*global require*/
let TopologicalInventory = require('@manageiq/topological_inventory');

console.log(TopologicalInventory);

/*
 * hard-coded provider specific functionality
 */
const sourceType2ProviderSpecific = source_type => {
    switch (source_type) {
        case 'openshift':
            return {
                role: 'kubernetes',
                source_type: 1 // suppose OpenShift is 1
                /* FIXME: replace with
                 * https://ci.foo.redhat.com:1337/r/insights/platform/topological-inventory/v0.0/source_types?name=amazon
                 * get id from there as source_type */
            };
        case 'amazon':
            return {
                role: 'aws',
                source_type: 2 // suppose AWS is 2
            };
    }
};

let apiInstance;

export function getApiInstance() {
    if (apiInstance) {
        return apiInstance;
    }

    apiInstance = new TopologicalInventory.DefaultApi();
    let defaultClient = TopologicalInventory.ApiClient.instance;
    defaultClient.basePath = TOPOLOGICAL_INVENTORY_API_BASE;
    return apiInstance;
}

export function doRemoveSource(sourceId) {
    return getApiInstance().deleteSource(sourceId).then((sourceDataOut) => {
        console.log('API call deleteSource returned data: ', sourceDataOut);
    }, (_error) => {
        console.error('Source removal failed.');
        throw { error: 'Source removal failed.' };
    });
}

export function doCreateSource(formData) {
    console.log('doCreateSource', formData);

    // lookup hard-coded values
    const providerData = sourceType2ProviderSpecific(formData.source_type);

    let sourceData = {
        tenant_id: 1, /* FIXME: get it from somewhere. Session? */
        name: formData.source_name,
        source_type_id: providerData.source_type
    };

    return getApiInstance().createSource(sourceData).then((sourceDataOut) => {
        console.log('API call createSource returned data: ', sourceDataOut);

        // For now we parse these from a single 'URL' field.
        /* TODO: need to create a component for entry of these */
        let scheme;
        let host;
        let port;

        if (formData.url) {
            const parsed = formData.url.match('(https?)://(.*?):([0-9]*)?$');
            scheme = parsed[1];
            host = parsed[2];
            port = parsed[3];
        }

        const endpointData = {
            source_id: parseInt(sourceDataOut.id, 10),
            tenant_id: parseInt(sourceDataOut.tenant_id, 10),
            role: providerData.role, // formData.role, // 'kubernetes'
            scheme,
            port: parseInt(port, 10),
            host,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        return getApiInstance().createEndpoint(endpointData).then((endpointDataOut) => {
            console.log('API call createEndpoint returned data: ', endpointDataOut);

            const authenticationData = {
                resource_id: parseInt(endpointDataOut.id, 10),
                resource_type: 'Endpoint',
                tenant_id: parseInt(sourceDataOut.tenant_id, 10),
                password: formData.token
            };

            return getApiInstance().createAuthentication(authenticationData).then((authenticationDataOut) => {
                console.log('API call createAuthentication returned data: ', authenticationDataOut);

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
        //throw new Error(error);
    });
}
