/* eslint-disable max-len */
import axios from 'axios';
import * as interceptors from '../frontend-components-copies/interceptors';

import { SOURCES_API_BASE } from './constants';

export const graphQlErrorInterceptor = response => {
    if (response.errors && response.errors.length > 0) {
        return Promise.reject({ detail: response.errors[0].message });
    }

    return response;
};

export const interceptor403 = error => {
    if (error.errors && error.errors[0].status === 403) {
        return Promise.reject({ detail: error.errors[0].detail, title: 'Forbidden access' });;
    }

    throw error;
};

const axiosInstanceInsights = axios.create();
axiosInstanceInsights.interceptors.request.use(interceptors.authInterceptor);
axiosInstanceInsights.interceptors.response.use(interceptors.responseDataInterceptor);
axiosInstanceInsights.interceptors.response.use(null, interceptors.interceptor401);
axiosInstanceInsights.interceptors.response.use(null, interceptors.interceptor500);
axiosInstanceInsights.interceptors.response.use(null, interceptors.errorInterceptor);
axiosInstanceInsights.interceptors.response.use(graphQlErrorInterceptor);
axiosInstanceInsights.interceptors.response.use(null, interceptor403);

export { axiosInstanceInsights as axiosInstance };

export const getSourcesApi = () => ({
    checkAvailabilitySource: (id) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/sources/${id}/check_availability`),
    updateSource: (id, data) => axiosInstanceInsights.patch(`${SOURCES_API_BASE}/sources/${id}`, data),
    updateEndpoint: (id, data) => axiosInstanceInsights.patch(`${SOURCES_API_BASE}/endpoints/${id}`, data),
    createEndpoint: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/endpoints`, data),
    updateAuthentication: (id, data) => axiosInstanceInsights.patch(`${SOURCES_API_BASE}/authentications/${id}`, data),
    createAuthentication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/authentications`, data),
    showSource: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE}/sources/${id}`),
    listSourceEndpoints: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE}/sources/${id}/endpoints`),
    listSourceApplications: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE}/sources/${id}/applications`),
    listEndpointAuthentications: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE}/endpoints/${id}/authentications`),
    deleteSource: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE}/sources/${id}`),
    createApplication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/applications`, data),
    postGraphQL: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE}/graphql`, data),
    listSourceTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE}/source_types`),
    doLoadAppTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE}/application_types`),
    deleteApplication: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE}/applications/${id}`)
});

export const doLoadAppTypes = () => getSourcesApi().doLoadAppTypes();

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
