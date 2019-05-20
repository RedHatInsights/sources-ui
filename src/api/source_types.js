import { getSourcesApi } from './entities.js';

export const doLoadSourceTypes = () =>
    getSourcesApi().listSourceTypes().then(data => data.data);
