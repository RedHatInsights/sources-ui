export const ACTION_TYPES = [
  'LOAD_ENTITIES',
  'CREATE_SOURCE',
  'REMOVE_SOURCE',
  'LOAD_SOURCE_TYPES',
  'LOAD_APP_TYPES',
  'REMOVE_APPLICATION',
].reduce(
  (acc, curr) => ({
    ...acc,
    [curr]: curr,
    [`${curr}_PENDING`]: `${curr}_PENDING`,
    [`${curr}_FULFILLED`]: `${curr}_FULFILLED`,
    [`${curr}_REJECTED`]: `${curr}_REJECTED`,
  }),
  {}
);

export const SORT_ENTITIES = 'SORT_ENTITIES';
export const PAGE_AND_SIZE = 'PAGE_AND_SIZE';
export const FILTER_SOURCES = 'FILTER_SOURCES';
export const ADD_APP_TO_SOURCE = 'ADD_APP_TO_SOURCE';
export const SET_COUNT = 'SET_COUNT';
export const ADD_HIDDEN_SOURCE = 'ADD_HIDDEN_SOURCE';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
