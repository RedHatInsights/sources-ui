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

    //let body = new TopologicalInventory.Id(); // Id
    //{id, name, uid, tenant_id}
    //return apiInstance.createSource(body);
    // [{"id":1,"name":null,
    // "uid":"0b4e4948-14f5-4940-85b4-b7da98250590",
    // "created_at":"2018-11-26T17:51:21.406Z","updated_at":"2018-11-26T17:51:21.406Z",
    // "tenant_id":1,"source_type_id":1}]
    let body = {
        tenant_id: 1,
        name: formData.name,
        source_type_id: 1,
    };

    return apiInstance.createSource(body).then((data) => {
        console.log('API called successfully. Returned data: ' + data);
        return data;
    }, (error) => {
        console.error(error);
        throw new Error(error);
    });
}
