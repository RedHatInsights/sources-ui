export const API_BASE = 'http://lucifer.usersys.redhat.com:3001/Fryguy/topological_inventory/0.0.1/providers';

export function getEntities () {
    return fetch(API_BASE).then(r => {
        if (r.ok || r.type == 'opaque') {
            return r.json();
        }
        throw new Error(`Unexpected response code ${r.status}`);
    });
}
