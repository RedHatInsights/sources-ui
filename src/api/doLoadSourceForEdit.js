import { getSourcesApi } from './entities';
import { getCmValues } from './getCmValues';

export const doLoadSourceForEdit = sourceId => Promise.all([
    getSourcesApi().showSource(sourceId),
    getSourcesApi().listSourceEndpoints(sourceId),
    getSourcesApi().listSourceApplications(sourceId),
    getCmValues(sourceId).catch(() => undefined)
]).then(([sourceData, endpoints, applications, costManagement]) => {
    const endpoint = endpoints && endpoints.data && endpoints.data[0];

    let basicValues = {
        source: sourceData,
        applications: applications.data
    };

    if (costManagement) {
        basicValues = {
            ...basicValues,
            billing_source: costManagement.billing_source,
            credentials: costManagement.authentication
        };
    }

    if (!endpoint) { // bail out
        return basicValues;
    }

    return getSourcesApi().listEndpointAuthentications(endpoint.id).then(authentications => ({
        ...basicValues,
        endpoints: endpoints.data,
        authentications: authentications.data
    }));
});
