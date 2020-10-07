export const ACTION_TYPES = ['SET_ORG_ADMIN'].reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: curr,
    [`${curr}_PENDING`]: `${curr}_PENDING`,
    [`${curr}_FULFILLED`]: `${curr}_FULFILLED`,
    [`${curr}_REJECTED`]: `${curr}_REJECTED`,
  }),
  {}
);
