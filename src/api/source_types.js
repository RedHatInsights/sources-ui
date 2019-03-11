import { getApiInstance } from './entities.js';

export function doLoadSourceTypes() {
    let opts = {
        limit: 100,
        offset: 0
    };
    return getApiInstance().listSourceTypes(opts).then((data) => {
        return data.data;
    }, (error) => {
        console.error(error);
        return [];
    });
}

;
