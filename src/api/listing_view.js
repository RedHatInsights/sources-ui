import { join, times } from 'lodash'
import { viewDefinitions } from '../views/viewDefinitions'

export function generateRandomData(num) {
    var rows = []
    for (var i = 1; i <= num; i++) {
        rows.push({
            id: i,
            name: `foobar ${Math.round(Math.random()*1000)}`,
            cluster: 'Default',
            host: `foo.bar.host${Math.round(Math.random()*1000)}`,
            ip_address: join(times(4, i => Math.round(Math.random()*256)), '.'),
            datastore: 'My store'
        });
    }
    return rows
}

export function doLoadListingData() {
    console.debug('doLoadListingData');
    //const url = 'https://topological-inventory-api-topological-inventory-ci.10.8.96.54.nip.io/api/v0.0/sources/1/container_projects/'
    const url = viewDefinitions.container_projects.url;

    return fetch(url).then(r => {
        if (r.ok || r.type == 'opaque') {
            return r.json();
            //return generateRandomData(100)
        }
        throw new Error(`Unexpected response code ${r.status}`);
    });
}

