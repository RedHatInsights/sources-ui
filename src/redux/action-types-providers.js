const asyncActions = [
    'LOAD_ENTITIES',
    'CREATE_SOURCE',
    'REMOVE_SOURCE',
    'LOAD_SOURCE_TYPES',
    'LOAD_APP_TYPES',
    'REMOVE_APPLICATION'
].reduce((acc, curr) => [
    ... acc,
    ...[curr, `${curr}_PENDING`, `${curr}_FULFILLED`, `${curr}_REJECTED`]
], []);

export const ACTION_TYPES = [
    ...asyncActions
].reduce((acc, curr) => {
    acc[curr] = curr;
    return acc;
}, {});

export const SORT_ENTITIES = 'SORT_ENTITIES';
export const PAGE_AND_SIZE = 'PAGE_AND_SIZE';
export const FILTER_PROVIDERS  = 'FILTER_PROVIDERS';
export const ADD_APP_TO_SOURCE = 'ADD_APP_TO_SOURCE';
export const UNDO_ADD_SOURCE = 'UNDO_ADDD_SOURCE';
export const CLEAR_ADD_SOURCE = 'CLEAR_ADD_SOURCE';
export const SET_COUNT = 'SET_COUNT';
export const ADD_HIDDEN_SOURCE = 'ADD_HIDDEN_SOURCE';
export const CLEAR_FILTERS = 'CLEAR_FILTERS';
