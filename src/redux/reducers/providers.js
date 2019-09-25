import {
    ACTION_TYPES,
    SORT_ENTITIES,
    PAGE_AND_SIZE,
    FILTER_PROVIDERS,
    SET_FILTER_COLUMN,
    SOURCE_EDIT_REQUEST,
    SOURCE_FOR_EDIT_LOADED,
    ADD_APP_TO_SOURCE
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

const sourceEditRemovePending = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? { ...entity, isDeleting: true } : entity)
});

const sourceEditRemoveFulfilled = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? undefined : entity).filter(x => x),
    numberOfEntities: state.numberOfEntities - 1
});

const sourceEditRemoveRejected = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? { ...entity, isDeleting: undefined } : entity)
});

const appRemovingPending = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ?
        {
            ...entity,
            applications: entity.applications.map((app) => app.id === meta.appId ? ({
                ...app,
                isDeleting: true
            }) : app)
        }
        : entity)
});

const appRemovingFulfilled = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ?
        {
            ...entity,
            applications: entity.applications.filter((app) => app.id !== meta.appId)
        }
        : entity)
});

const appRemovingRejected = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ?
        {
            ...entity,
            applications: entity.applications.map((app) => app.id === meta.appId ? ({
                ...app,
                isDeleting: undefined
            }) : app)
        }
        : entity)
});

const addAppToSource = (state, { payload: { sourceId, app } }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === sourceId ?
        {
            ...entity,
            applications: [...entity.applications, app]
        }
        : entity)
});

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [ACTION_TYPES.LOAD_ENTITIES_REJECTED]: entitiesRejected,
    [ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING]: sourceTypesPending,
    [ACTION_TYPES.LOAD_SOURCE_TYPES_FULFILLED]: sourceTypesLoaded,
    [ACTION_TYPES.LOAD_APP_TYPES_PENDING]: appTypesPending,
    [ACTION_TYPES.LOAD_APP_TYPES_FULFILLED]: appTypesLoaded,
    [ACTION_TYPES.REMOVE_SOURCE_PENDING]: sourceEditRemovePending,
    [ACTION_TYPES.REMOVE_SOURCE_FULFILLED]: sourceEditRemoveFulfilled,
    [ACTION_TYPES.REMOVE_SOURCE_REJECTED]: sourceEditRemoveRejected,
    [ACTION_TYPES.REMOVE_APPLICATION_PENDING]: appRemovingPending,
    [ACTION_TYPES.REMOVE_APPLICATION_FULFILLED]: appRemovingFulfilled,
    [ACTION_TYPES.REMOVE_APPLICATION_REJECTED]: appRemovingRejected,

    [SORT_ENTITIES]: sortEntities,
    [PAGE_AND_SIZE]: setPageAndSize,
    [FILTER_PROVIDERS]: filterProviders,
    [SET_FILTER_COLUMN]: setFilterColumn,
    [SOURCE_FOR_EDIT_LOADED]: sourceForEditLoaded,
    [SOURCE_EDIT_REQUEST]: sourceEditRequest,
    [ADD_APP_TO_SOURCE]: addAppToSource
};
