import axiosInstanceInsights from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';

import { SOURCES_API_BASE } from './constants';

axiosInstanceInsights.interceptors.response.use(response => {
    if (response.errors && response.errors.length > 0) {
        return Promise.reject({ detail: response.errors[0].message });
    }

    return response;
});

export { axiosInstanceInsights as axiosInstance };

let apiInstance;

export const getSourcesApi = () =>
    apiInstance || (apiInstance = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstanceInsights));

export const doLoadAppTypes = () =>
    axiosInstanceInsights.get(`${SOURCES_API_BASE}/application_types`);

export function doRemoveSource(sourceId) {
    return getSourcesApi().deleteSource(sourceId).catch((error) => {
        throw { error: { detail: error.errors[0].detail } };
    });
}

export const doLoadSourceForEdit = sourceId => Promise.all([
    getSourcesApi().showSource(sourceId),
    getSourcesApi().listSourceEndpoints(sourceId),
    getSourcesApi().listSourceApplications(sourceId)
]).then(([sourceData, endpoints, applications]) => {
    const endpoint = endpoints && endpoints.data && endpoints.data[0];

    if (!endpoint) { // bail out
        return {
            source: sourceData,
            applications: applications.data
        };
    }

    return getSourcesApi().listEndpointAuthentications(endpoint.id).then(authentications => ({
        source: sourceData,
        endpoints: endpoints.data,
        authentications: authentications.data,
        applications: applications.data
    }));
});

export const pagination = (pageSize, pageNumber) =>
    `limit:${pageSize}, offset:${(pageNumber - 1) * pageSize}`;

export const sorting = (sortBy, sortDirection) =>
    sortBy ? `, sort_by:"${sortBy}:${sortDirection}"` : '';

export const filtering = (filterValue) =>
    filterValue ? `, filter: { name: { contains_i: "${filterValue}"} }` : '';

export const doLoadEntities = ({ pageSize, pageNumber, sortBy, sortDirection, filterValue }) => getSourcesApi().postGraphQL({
    query: `{ sources(${pagination(pageSize, pageNumber)}${sorting(sortBy, sortDirection)}${filtering(filterValue)})
        {
            id,
            created_at,
            source_type_id,
            name,
            tenant,
            uid,
            updated_at,
            imported,
            applications { application_type_id, id },
            endpoints { id, scheme, host, port, path }
        }
    }`
}).then(({ data }) => data);

export const doCreateApplication = (source_id, application_type_id) => getSourcesApi().createApplication({
    source_id,
    application_type_id
});

export const doDeleteApplication = (appId, errorMessage) =>
    getSourcesApi()
    .deleteApplication(appId)
    .catch(({ errors: [{ detail }] }) => { throw { error: { title: errorMessage, detail } };});

export const doLoadCountOfSources1 = (filterValue) => getSourcesApi().listSources(
    0, 100, { name: { contains_i: filterValue } }
);

export const doLoadCountOfSources = (filterValue = '') =>
    axiosInstanceInsights.get(`${SOURCES_API_BASE}/sources?filter[name][contains_i]=${filterValue}`);
