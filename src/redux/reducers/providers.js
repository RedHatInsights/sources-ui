import {
    ACTION_TYPES,
    SORT_ENTITIES,
    PAGE_AND_SIZE,
    FILTER_PROVIDERS,
    SET_FILTER_COLUMN,
    SOURCE_EDIT_REQUEST,
    SOURCE_FOR_EDIT_LOADED
} from '../action-types-providers';

export const defaultProvidersState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1, // PF numbers pages from 1. Seriously.
    entities: [],
    numberOfEntities: 0,
    filterColumn: 'name', // temporary hard-coded filtering by name
    appTypesLoaded: false,
    sourceTypesLoaded: false
};

const entitiesPending = (state) => ({
    ...state,
    loaded: false
});

const entitiesLoaded = (state, { payload: rows }) => ({
    ...state,
    loaded: true,
    entities: rows,
    numberOfEntities: rows.length
});

const entitiesRejected = (state, { payload: { error } }) => ({
    ...state,
    fetchingError: error
});

const sourceTypesPending = (state) => ({
    ...state,
    sourceTypes: [],
    sourceTypesLoaded: false
});

const sourceTypesLoaded = (state, { payload: sourceTypes }) => ({
    ...state,
    sourceTypes,
    sourceTypesLoaded: true
});

const appTypesPending = (state) => ({
    ...state,
    appTypes: [],
    appTypesLoaded: false
});

const appTypesLoaded = (state, { payload: appTypes }) => ({
    ...state,
    appTypes,
    appTypesLoaded: true
});

const sortEntities = (state, { payload: { column, direction } }) => ({
    ...state,
    sortBy: column,
    sortDirection: direction
});

const setPageAndSize = (state, { payload: { page, size } }) => ({
    ...state,
    pageSize: size,
    pageNumber: page
});

const filterProviders = (state, { payload: { value } }) =>({
    ...state,
    filterValue: value
});

const setFilterColumn = (state, { payload: { column } }) => ({
    ...state,
    filterColumn: column
});

const sourceForEditLoaded = (state, { payload }) => ({
    ...state,
    source: payload
});

const sourceEditRequest = (state) => ({
    ...state,
    source: null
});

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [ACTION_TYPES.LOAD_ENTITIES_REJECTED]: entitiesRejected,
    [ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING]: sourceTypesPending,
    [ACTION_TYPES.LOAD_SOURCE_TYPES_FULFILLED]: sourceTypesLoaded,
    [ACTION_TYPES.LOAD_APP_TYPES_PENDING]: appTypesPending,
    [ACTION_TYPES.LOAD_APP_TYPES_FULFILLED]: appTypesLoaded,

    [SORT_ENTITIES]: sortEntities,
    [PAGE_AND_SIZE]: setPageAndSize,
    [FILTER_PROVIDERS]: filterProviders,
    [SET_FILTER_COLUMN]: setFilterColumn,
    [SOURCE_FOR_EDIT_LOADED]: sourceForEditLoaded,
    [SOURCE_EDIT_REQUEST]: sourceEditRequest
};
