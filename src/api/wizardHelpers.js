import { getSourcesApi } from './entities';

export const doLoadSourceTypes = () =>
  getSourcesApi()
    .listSourceTypes()
    // RH marketplace is not supposed to show up and is not supposed to even exist
    // Until we know why we get in the UI, we filter it out for now
    // Unable to use != query param
    .then((data) => ({
      sourceTypes: data.data.filter(({ name }) => name !== 'rh-marketplace'),
    }));

export const doLoadApplicationTypes = () =>
  getSourcesApi()
    .doLoadAppTypes()
    .then((data) => ({ applicationTypes: data.data }));

export const findSource = (name) =>
  getSourcesApi().postGraphQL({
    query: `{ sources(filter: {name: "name", value: "${name}"})
        { id, name }
    }`,
  });
