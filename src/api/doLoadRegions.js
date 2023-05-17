import { getCostApi } from './entities.js';

export const doLoadRegions = () =>
  getCostApi()
    .listAwsRegions()
    .then((response) => response.data)
    .catch(() => {});
