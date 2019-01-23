export const SOURCES_API_BASE = '/r/insights/platform/topological-inventory/v0.0';
import { sourcesViewDefinition } from '../views/sourcesViewDefinition';

export function getEntities () {
    return fetch(sourcesViewDefinition.url).then(r => {
        if (r.ok || r.type === 'opaque') {
            return r.json();
        }

        throw new Error(`Unexpected response code ${r.status}`);
    });
}

//import * as TopologicalInventory from '../TopologyClient/src/index'
//import * as TopologicalInventory from '../../../TopologyClient'
/*global require*/
let TopologicalInventory = require('@manageiq/topological_inventory');

console.log(TopologicalInventory);

export function doCreateSource (formData) {
    let apiInstance = new TopologicalInventory.DefaultApi();

    let defaultClient = TopologicalInventory.ApiClient.instance;
    defaultClient.basePath = SOURCES_API_BASE;

    let sourceData = {
        tenant_id: 1, // FIXME: where do I get it?
        name: formData.name,
        source_type_id: 1 // FIXME should come from the form
    };

    return apiInstance.createSource(sourceData).then((sourceDataOut) => {
        console.log('API call createSource returned data: ', sourceDataOut);

        // For now we parse these from a single 'URL' field.
        // TODO: need to create a component for entry of these
        const parsed = formData.url.match('(https?)://(.*?):([0-9]*)?$');
        const schema = parsed[1];
        const host = parsed[2];
        const port = parsed[3];

        const endpointData = {
            source_id: parseInt(sourceDataOut.id, 10),
            tenant_id: parseInt(sourceDataOut.tenant_id, 10),
            role: formData.role, // 'kubernetes'
            schema,
            port: parseInt(port, 10),
            host,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority
        };

        return apiInstance.createEndpoint(endpointData).then((endpointDataOut) => {
            console.log('API call createEndpoint returned data: ', endpointDataOut);

            const authenticationData = {
                resource_id: parseInt(endpointDataOut.id, 10),
                resource_type: 'Endpoint',
                tenant_id: parseInt(sourceDataOut.tenant_id, 10),
                token: formData.token
            };

            return apiInstance.createAuthentication(authenticationData).then((authenticationDataOut) => {
                console.log('API call createAuthentication returned data: ', authenticationDataOut);

                return authenticationDataOut;
            }, (_error) => {
                console.error('Authentication creation failure.');
                throw { error: 'Authentication creation failure.' };
            });

            //return endpointDataOut;
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
