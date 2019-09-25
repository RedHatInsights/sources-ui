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
export const SET_FILTER_COLUMN = 'SET_FILTER_COLUMN';
export const SOURCE_EDIT_REQUEST = 'SOURCE_EDIT_REQUEST';
export const SOURCE_FOR_EDIT_LOADED = 'SOURCE_FOR_EDIT_LOADED';
export const ADD_APP_TO_SOURCE = 'ADD_APP_TO_SOURCE';
