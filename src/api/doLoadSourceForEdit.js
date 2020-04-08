import { getSourcesApi } from './entities';
import { getCmValues } from './getCmValues';

export const doLoadSourceForEdit = (source) => Promise.all([
    getSourcesApi().showSource(source.id),
    getSourcesApi().listSourceEndpoints(source.id),
    getSourcesApi().listSourceApplications(source.id),
    getCmValues(source.id).catch(() => undefined)
]).then(([sourceData, endpoints, applications, costManagement]) => {
    const endpoint = endpoints && endpoints.data && endpoints.data[0];

    let basicValues = {
        source: {
            ...source,
            ...sourceData
        },
        applications: applications.data
    };

    if (costManagement) {
        basicValues = {
            ...basicValues,
            billing_source: costManagement.billing_source,
            credentials: costManagement.authentication.credentials
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
