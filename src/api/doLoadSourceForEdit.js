import { getSourcesApi, doLoadApplicationsForEdit } from './entities';
import { getCmValues } from './getCmValues';

export const doLoadSourceForEdit = (source, hasCostManagement) =>
  Promise.all([
    getSourcesApi().showSource(source.id),
    getSourcesApi().listSourceEndpoints(source.id),
    doLoadApplicationsForEdit(source.id),
    hasCostManagement && getCmValues(source.id).catch(() => undefined),
  ]).then(async ([sourceData, endpoints, applications, costManagement]) => {
    const endpoint = endpoints && endpoints.data && endpoints.data[0];

    const apps = applications?.sources[0]?.applications || [];

    let basicValues = {
      source: {
        ...source,
        ...sourceData,
      },
      applications: apps,
    };

    if (costManagement) {
      basicValues = {
        ...basicValues,
        billing_source: costManagement.billing_source,
        credentials: costManagement.authentication.credentials,
      };
    }

    const promises = [];
    let appAuths;
    const addToApp = [];
    const appAuthenticationIds = [];

    apps.forEach((app) => {
      app?.authentications?.forEach((auth) => {
        if (auth?.id) {
          promises.push(getSourcesApi().showAuthentication(auth.id));
          addToApp.push(app.id);
          appAuthenticationIds.push(auth.id);
        }
      });
    });

    if (promises.length > 0) {
      appAuths = await Promise.all(promises);

      addToApp.forEach((id, index) => {
        basicValues.applications.find((app) => app.id === id).authentications.push(appAuths[index]);
      });
    }

    if (!endpoint) {
      return basicValues;
    }

    return getSourcesApi()
      .listEndpointAuthentications(endpoint.id)
      .then((authentications) => ({
        ...basicValues,
        endpoints: endpoints.data,
        authentications: authentications.data.filter(({ id }) => !appAuthenticationIds.includes(id)),
      }));
  });
