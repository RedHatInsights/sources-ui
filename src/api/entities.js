//export const API_BASE = 'http://lucifer.usersys.redhat.com:3001/Fryguy/topological_inventory/0.0.1/providers';
export const SOURCES_API_BASE = 'https://topological-inventory-api-topological-inventory-ci.10.8.96.54.nip.io/api/v0.0/sources/'
import { sourcesViewDefinition } from '../views/sourcesViewDefinition'

export function getEntities () {
    return fetch(sourcesViewDefinition.url).then(r => {
        if (r.ok || r.type == 'opaque') {
            return r.json();
        }
        throw new Error(`Unexpected response code ${r.status}`);
    });
}


import * as TopologicalInventory from '../TopologyClient/src/index'

export function doCreateSource (formData) {
    let apiInstance = new TopologicalInventory.DefaultApi();
    apiInstance.basePath = SOURCES_API_BASE;

    let sourceData = {
        tenant_id: 1,
        name: formData.name,
        source_type_id: 1,
    };

    return apiInstance.createSource(sourceData).then((sourceData) => {
        console.log('API call createSource returned data: ', sourceData);

        // For now we parse these from a single 'URL' field.
        // TODO: need to create a component for entry of these
        const parsed = formData.url.match('(https?)://(.*?):([0-9]*)?$');
        const schema = parsed[1];
        const host = parsed[2];
        const port = parsed[3];

        const endpointData = {
            source_id: parseInt(sourceData.id, 10),
            tenant_id: parseInt(sourceData.tenant_id, 10),
            role: formData.role, // 'kubernetes'
            schema: schema,
            port: parseInt(port, 10),
            host: host,
            verify_ssl: formData.verify_ssl,
            certificate_authority: formData.certificate_authority,
            // TODO: authentications: token
        }

        return apiInstance.createEndpoint(endpointData).then((data) => {
            console.log('API call createEndpoint returned data: ', data);
            return data;
        }, (error) => {
            console.error('endpoint creation failure');
        })

    }, (error) => {
        console.error(error);
        throw new Error(error);
    });
}
