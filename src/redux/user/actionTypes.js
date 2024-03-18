export const ACTION_TYPES = ['SET_WRITE_PERMISSIONS', 'SET_ORG_ADMIN', 'SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS'].reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: curr,
    [`${curr}_PENDING`]: `${curr}_PENDING`,
    [`${curr}_FULFILLED`]: `${curr}_FULFILLED`,
    [`${curr}_REJECTED`]: `${curr}_REJECTED`,
  }),
  {},
);
