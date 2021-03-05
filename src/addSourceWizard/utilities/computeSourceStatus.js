export const computeSourceStatus = (source) => {
  const appStatuses = source.applications?.map(({ availability_status }) => availability_status || 'timeout') || [];
  const endpointStatuses = source.endpoint?.map(({ availability_status }) => availability_status || 'timeout') || [];
  const authenticationsStatuses = source.authentiations?.map(({ availability_status }) => availability_status || 'timeout') || [];

  const statuses = [...appStatuses, ...endpointStatuses, ...authenticationsStatuses];

  if (statuses.includes('unavailable')) {
    return 'unavailable';
  }

  if (statuses.length > 0 && statuses.every((status) => status === 'available')) {
    return 'available';
  }

  if (statuses.includes('timeout')) {
    return 'timeout';
  }

  return 'finished';
};

export default computeSourceStatus;
