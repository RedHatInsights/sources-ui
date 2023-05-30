import { getCostApi } from './entities.js';

export const doLoadRegions = () =>
  getCostApi()
    .listAwsRegions()
    .then((response) => response.data)
    .catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
      return [];
    });
