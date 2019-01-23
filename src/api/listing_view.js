import { join, times } from 'lodash';

export function generateRandomData(num) {
    let rows = [];
    for (let i = 1; i <= num; i++) {
        rows.push({
            id: i,
            name: `foobar ${Math.round(Math.random() * 1000)}`,
            cluster: 'Default',
            host: `foo.bar.host${Math.round(Math.random() * 1000)}`,
            ip_address: join(times(4, () => Math.round(Math.random() * 256)), '.'),
            datastore: 'My store'
        });
    }

    return rows;
}

export function doLoadListingData(viewDefinition) {
    const url = viewDefinition.url;

    return fetch(url).then(r => {
        if (r.ok || r.type === 'opaque') {
            return r.json();
        }

        throw new Error(`Unexpected response code ${r.status}`);
    });
}

