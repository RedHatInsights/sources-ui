import { getSourcesApi } from './entities';

export const doLoadSourceTypes = () =>
  getSourcesApi()
    .listSourceTypes()
    .then((data) => ({ sourceTypes: data.data }));

export const doLoadApplicationTypes = () =>
  getSourcesApi()
    .doLoadAppTypes()
    .then((data) => ({ applicationTypes: data.data }));

export const checkAccountHCS = async () => {
  const jwtToken = await insights.chrome.auth.getToken();
  return fetch(`https://billing.${insights.chrome.isProd() ? '' : 'stage.'}api.redhat.com/v1/authorization/hcsEnrollment`, {
    headers: { Authorization: `Bearer ${jwtToken}` },
  }).then((response) => {
    if (response.status !== 200) {
      console.error(`Failed to verify HCS enrollment: ${response.statusText}`);
      return { hcsDeal: false };
    }

    return response.json();
  });
};

export const findSource = (name) =>
  getSourcesApi().postGraphQL({
    query: `{ sources(filter: {name: "name", value: "${name}"})
        { id, name }
    }`,
  });
