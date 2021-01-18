import axios from 'axios';
import * as interceptors from '../frontend-components-copies/interceptors';
import { CLOUD_VENDOR, CLOUD_VENDORS, REDHAT_VENDOR } from '../utilities/constants';

import { SOURCES_API_BASE_V3 } from './constants';

export const graphQlErrorInterceptor = (response) => {
  if (response.errors && response.errors.length > 0) {
    return Promise.reject({ detail: response.errors[0].message });
  }

  return response;
};

export const interceptor403 = (error) => {
  if (error.errors && error.errors[0].status === 403) {
    return Promise.reject({
      detail: error.errors[0].detail,
      title: 'Forbidden access',
    });
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
  checkAvailabilitySource: (id) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/sources/${id}/check_availability`),
  updateSource: (id, data) => axiosInstanceInsights.patch(`${SOURCES_API_BASE_V3}/sources/${id}`, data),
  updateEndpoint: (id, data) => axiosInstanceInsights.patch(`${SOURCES_API_BASE_V3}/endpoints/${id}`, data),
  createEndpoint: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/endpoints`, data),
  updateAuthentication: (id, data) => axiosInstanceInsights.patch(`${SOURCES_API_BASE_V3}/authentications/${id}`, data),
  createAuthentication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/authentications`, data),
  showSource: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/sources/${id}`),
  listSourceEndpoints: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/sources/${id}/endpoints`),
  listSourceApplications: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/sources/${id}/applications`),
  listEndpointAuthentications: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/endpoints/${id}/authentications`),
  deleteSource: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE_V3}/sources/${id}`),
  createApplication: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/applications`, data),
  postGraphQL: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/graphql`, data),
  listSourceTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/source_types`),
  doLoadAppTypes: () => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/application_types`),
  deleteApplication: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE_V3}/applications/${id}`),
  createAuthApp: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/application_authentications`, data),
  deleteAuthentication: (id) => axiosInstanceInsights.delete(`${SOURCES_API_BASE_V3}/authentications/${id}`),
  showAuthentication: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/authentications/${id}`),
  updateApplication: (id, data) => axiosInstanceInsights.patch(`${SOURCES_API_BASE_V3}/applications/${id}`, data),
});

export const doLoadAppTypes = () => getSourcesApi().doLoadAppTypes();

export const doRemoveSource = (sourceId) =>
  getSourcesApi()
    .deleteSource(sourceId)
    .catch((error) => {
      throw { error: { detail: error.errors[0].detail } };
    });

export const pagination = (pageSize, pageNumber) => `limit:${pageSize}, offset:${(pageNumber - 1) * pageSize}`;

export const sorting = (sortBy, sortDirection) => {
  if (!sortBy) {
    return '';
  }

  if (sortBy === 'source_type_id') {
    return `,sort_by:{source_type:{product_name:"${sortDirection}"}}`;
  }

  if (sortBy === 'applications') {
    return `,sort_by:{applications:{__count:"${sortDirection}"}}`;
  }

  return `,sort_by:{${sortBy}:"${sortDirection}"}`;
};

export const filtering = (filterValue = {}, activeVendor) => {
  let filterQueries = [];

  if (filterValue.name) {
    filterQueries.push(`name: { contains_i: "${filterValue.name}" }`);
  }

  if (filterValue.source_type_id && filterValue.source_type_id.length > 0) {
    filterQueries.push(`source_type_id: { eq: [${filterValue.source_type_id.map((x) => `"${x}"`).join(', ')}] }`);
  }

  if (filterValue.applications && filterValue.applications.length > 0) {
    filterQueries.push(
      `applications: { application_type_id: { eq: [${filterValue.applications.map((x) => `"${x}"`).join(', ')}] }}`
    );
  }

  if (activeVendor === CLOUD_VENDOR) {
    filterQueries.push(`source_type: { vendor: { eq: [${CLOUD_VENDORS.map((x) => `"${x}"`).join(', ')}]} }`);
  }

  if (activeVendor === REDHAT_VENDOR) {
    filterQueries.push('source_type: { vendor: "Red Hat" }');
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
    imported,
    availability_status,
    source_ref,
    last_checked_at,
    updated_at,
    last_available_at,
    applications { application_type_id, id, availability_status_error, availability_status, authentications { id, resource_type } },
    endpoints { id, scheme, host, port, path, receptor_node, role, certificate_authority, verify_ssl, availability_status_error, availability_status, authentications { authtype, availability_status, availability_status_error } }
`;

export const doLoadEntities = ({ pageSize, pageNumber, sortBy, sortDirection, filterValue, activeVendor }) =>
  getSourcesApi()
    .postGraphQL({
      query: `{ sources(${pagination(pageSize, pageNumber)}${sorting(sortBy, sortDirection)}${filtering(
        filterValue,
        activeVendor
      )})
        { ${graphQlAttributes} }
    }`,
    })
    .then(({ data }) => data);

export const doCreateApplication = (data) => getSourcesApi().createApplication(data);

export const doDeleteApplication = (appId, errorMessage) =>
  getSourcesApi()
    .deleteApplication(appId)
    .catch(({ errors: [{ detail }] }) => {
      throw { error: { title: errorMessage, detail } };
    });

export const restFilterGenerator = (filterValue = {}, activeVendor) => {
  let filterQueries = [];

  if (filterValue.name) {
    filterQueries.push(`filter[name][contains_i]=${filterValue.name}`);
  }

  if (filterValue.source_type_id && filterValue.source_type_id.length > 0) {
    filterValue.source_type_id.map((id) => filterQueries.push(`filter[source_type_id][]=${id}`));
  }

  if (filterValue.applications && filterValue.applications.length > 0) {
    filterValue.applications.map((id) => filterQueries.push(`filter[applications][application_type_id][eq][]=${id}`));
  }

  if (activeVendor === CLOUD_VENDOR) {
    CLOUD_VENDORS.forEach((vendor) => filterQueries.push(`filter[source_type][vendor][eq][]=${vendor}`));
  }

  if (activeVendor === REDHAT_VENDOR) {
    filterQueries.push('filter[source_type][vendor]=Red Hat');
  }

  if (filterQueries.length > 0) {
    return filterQueries.join('&');
  }

  return '';
};

export const doLoadCountOfSources = (filterValue = {}, activeVendor) =>
  axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/sources?${restFilterGenerator(filterValue, activeVendor)}`);

export const doLoadSource = (id) =>
  getSourcesApi()
    .postGraphQL({
      query: `{ sources(filter: { id: { eq: ${id}}})
            { ${graphQlAttributes} }
        }`,
    })
    .then(({ data }) => data);

export const doLoadApplicationsForEdit = (id) =>
  getSourcesApi()
    .postGraphQL({
      query: `{ sources(filter: { id: { eq: ${id}}})
            { applications {
                application_type_id,
                id,
                availability_status_error,
                availability_status,
                authentications {
                    id
                }
            } }
        }`,
    })
    .then(({ data }) => data);

export const doDeleteAuthentication = (id) => getSourcesApi().deleteAuthentication(id);
