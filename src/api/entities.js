import axios from 'axios';
import get from 'lodash/get';
import set from 'lodash/set';

import { APP_NAMES } from '../components/SourceEditForm/parser/application';
import * as interceptors from '../frontend-components-copies/interceptors';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../utilities/constants';
import { AVAILABLE, PARTIALLY_UNAVAILABLE, UNAVAILABLE } from '../views/formatters';

import { SOURCES_API_BASE_V3 } from './constants';
import { cmConvertTypes, cmValuesMapper, getCmValues } from './getCmValues';

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
  showApplication: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/applications/${id}`),
  listSourceAuthentications: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/sources/${id}/authentications`),
  createSource: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/sources`, data),
  getEndpoint: (id) => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/endpoints/${id}`),
  getGoogleAccount: () => axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/app_meta_data?filter[name]=gcp_service_account`),
  bulkCreate: (data) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/bulk_create`, data),
  pauseApplication: (id) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/applications/${id}/pause`),
  unpauseApplication: (id) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/applications/${id}/unpause`),
  pauseSource: (id) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/sources/${id}/pause`),
  unpauseSource: (id) => axiosInstanceInsights.post(`${SOURCES_API_BASE_V3}/sources/${id}/unpause`),
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

  if (filterValue.source_type_id?.length > 0) {
    filterQueries.push(`source_type_id: { eq: [${filterValue.source_type_id.map((x) => `"${x}"`).join(', ')}] }`);
  }

  if (filterValue.applications?.length > 0) {
    filterQueries.push(
      `applications: { application_type_id: { eq: [${filterValue.applications.map((x) => `"${x}"`).join(', ')}] }}`
    );
  }

  if (activeVendor === CLOUD_VENDOR) {
    filterQueries.push(`source_type: { vendor: { not_eq: "Red Hat"} }`);
  }

  if (activeVendor === REDHAT_VENDOR) {
    filterQueries.push('source_type: { vendor: "Red Hat" }');
  }

  const status = filterValue.availability_status?.[0];
  if (status) {
    if (status === AVAILABLE) {
      filterQueries.push(`availability_status: { eq: "${AVAILABLE}" }`);
    } else if (status === UNAVAILABLE) {
      filterQueries.push(`availability_status: { eq: ["${PARTIALLY_UNAVAILABLE}", "${UNAVAILABLE}"] }`);
    }
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
    app_creation_workflow,
    paused_at,
    authentications { authtype, username, availability_status_error, availability_status }
    applications { application_type_id, id, availability_status_error, availability_status, paused_at, authentications { id, resource_type } },
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

  if (filterValue.source_type_id?.length > 0) {
    filterValue.source_type_id.map((id) => filterQueries.push(`filter[source_type_id][]=${id}`));
  }

  if (filterValue.applications?.length > 0) {
    filterValue.applications.map((id) => filterQueries.push(`filter[applications][application_type_id][eq][]=${id}`));
  }

  if (activeVendor === CLOUD_VENDOR) {
    filterQueries.push(`filter[source_type][vendor][not_eq]=Red Hat`);
  }

  if (activeVendor === REDHAT_VENDOR) {
    filterQueries.push('filter[source_type][vendor]=Red Hat');
  }

  const status = filterValue.availability_status?.[0];
  if (status) {
    if (status === AVAILABLE) {
      filterQueries.push(`filter[availability_status]=${AVAILABLE}`);
    } else if (status === UNAVAILABLE) {
      filterQueries.push(`filter[availability_status][]=${PARTIALLY_UNAVAILABLE}`);
      filterQueries.push(`filter[availability_status][]=${UNAVAILABLE}`);
    }
  }

  if (filterQueries.length > 0) {
    return filterQueries.join('&');
  }

  return '';
};

export const doLoadCountOfSources = (filterValue = {}, activeVendor) =>
  axiosInstanceInsights.get(`${SOURCES_API_BASE_V3}/sources?${restFilterGenerator(filterValue, activeVendor)}&limit=1`);

export const doLoadSource = (id) =>
  getSourcesApi()
    .postGraphQL({
      query: `{ sources(filter: { id: { eq: ${id}}})
            { ${graphQlAttributes} }
        }`,
    })
    .then(({ data }) => data);

export const doLoadApplicationsForEdit = async (id, appTypes, sourceTypes) => {
  let graphql = await getSourcesApi().postGraphQL({
    query: `{ sources(filter: { id: { eq: ${id}}})
          { source_type_id, applications {
              application_type_id,
              id,
              availability_status_error,
              availability_status,
              paused_at,
              authentications {
                  id
              }
          } }
      }`,
  });

  const promises = [];
  graphql.data.sources?.[0]?.applications?.forEach((app) => {
    promises.push(getSourcesApi().showApplication(app.id));
  });

  const results = await Promise.all(promises);

  const sourceType = sourceTypes.find(({ id }) => id === graphql.data.sources?.[0]?.source_type_id);
  const costManagementApp = appTypes.find(({ name }) => name === APP_NAMES.COST_MANAGAMENT);

  if (results.length) {
    // Doing for as forEach has some issues in jest with nested async functions
    for (let index = 0; index < results.length; index++) {
      const { extra, application_type_id } = results[index];
      const newExtra = { ...extra };

      if (
        application_type_id === costManagementApp.id &&
        cmConvertTypes.includes(sourceType.name) &&
        !Object.keys(extra).length
      ) {
        const cmValues = await getCmValues(id);
        Object.keys(cmValuesMapper).forEach((key) => {
          const value = get(cmValues, key);

          value && set(newExtra, cmValuesMapper[key], value);
        });
      }

      graphql.data.sources[0].applications[index] = {
        ...graphql.data.sources[0].applications[index],
        extra: newExtra,
      };
    }
  }

  return graphql.data;
};

export const doDeleteAuthentication = (id) => getSourcesApi().deleteAuthentication(id);
