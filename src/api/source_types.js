import { getSourcesApi } from './entities.js';

export function doLoadSourceTypes() {
    return getSourcesApi().listSourceTypes().then(data => data.data);
}
