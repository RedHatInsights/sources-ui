/* eslint-disable max-len */
import axiosInstanceInsights from '@redhat-cloud-services/frontend-components-utilities/files/interceptors';
import { DefaultApi as SourcesDefaultApi } from '@redhat-cloud-services/sources-client';

import { SOURCES_API_BASE } from './constants';

export const graphQlErrorInterceptor = response => {
    if (response.errors && response.errors.length > 0) {
        return Promise.reject({ detail: response.errors[0].message });
    }

    return response;
};

axiosInstanceInsights.interceptors.response.use(graphQlErrorInterceptor);

export { axiosInstanceInsights as axiosInstance };

let apiInstance;

export const getSourcesApi = () =>
    apiInstance || (apiInstance = new SourcesDefaultApi(undefined, SOURCES_API_BASE, axiosInstanceInsights));

export const doLoadAppTypes = () =>
    axiosInstanceInsights.get(`${SOURCES_API_BASE}/application_types`);

export const doRemoveSource = (sourceId) => getSourcesApi().deleteSource(sourceId).catch((error) => {
    throw { error: { detail: error.errors[0].detail } };
});

export const pagination = (pageSize, pageNumber) =>
    `limit:${pageSize}, offset:${(pageNumber - 1) * pageSize}`;

export const sorting = (sortBy, sortDirection) =>
    sortBy ? `, sort_by:"${sortBy}:${sortDirection}"` : '';

export const filtering = (filterValue = {}) => {;
    let filterQueries = [];

    if (filterValue.name) {
        filterQueries.push(`name: { contains_i: "${filterValue.name}" }`);
    }

    if (filterValue.source_type_id && filterValue.source_type_id.length > 0) {
        filterQueries.push(`source_type_id: { eq: [${filterValue.source_type_id.map(x => `"${x}"`).join(', ')}] }`);

    }

    if (filterQueries.length > 0) {
        return `, filter: { ${filterQueries.join(', ')} }`;
    }

    return '';
};

export const graphQlAttributes = `
    id,
    created_at,
    source_type_id,
    name,
    tenant,
    uid,
    updated_at,
    imported,
    availability_status,
    source_ref,
    applications { application_type_id, id, availability_status_error, availability_status },
    endpoints { id, scheme, host, port, path, receptor_node, role, certificate_authority, verify_ssl, availability_status_error, availability_status, authentications { authtype, availability_status, availability_status_error } }
`;

export const doLoadEntities = ({ pageSize, pageNumber, sortBy, sortDirection, filterValue }) => getSourcesApi().postGraphQL({
    query: `{ sources(${pagination(pageSize, pageNumber)}${sorting(sortBy, sortDirection)}${filtering(filterValue)})
        { ${graphQlAttributes} }
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

export const restFilterGenerator = (filterValue = {}) => {
    let filterQueries = [];

    if (filterValue.name) {
        filterQueries.push(`filter[name][contains_i]=${filterValue.name}`);
    }

    if (filterValue.source_type_id && filterValue.source_type_id.length > 0) {
        filterValue.source_type_id.map((id) => filterQueries.push(`filter[source_type_id][]=${id}`));
    }

    if (filterQueries.length > 0) {
        return filterQueries.join('&');
    }

    return '';
};

export const doLoadCountOfSources = (filterValue = {}) =>
    axiosInstanceInsights.get(`${SOURCES_API_BASE}/sources?${restFilterGenerator(filterValue)}`);

export const doLoadSource = (id) => getSourcesApi().postGraphQL({
    query: `{ sources(filter: { id: { eq: ${id}}})
            { ${graphQlAttributes} }
        }`
}).then(({ data }) => data);
