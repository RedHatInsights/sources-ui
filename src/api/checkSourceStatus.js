import { getSourcesApi } from './entities';

export const checkSourceStatus = (id) =>
  getSourcesApi()
    .checkAvailabilitySource(id)
    .catch(() => {});
