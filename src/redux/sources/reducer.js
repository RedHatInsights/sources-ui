import {
    ACTION_TYPES,
    SORT_ENTITIES,
    PAGE_AND_SIZE,
    FILTER_SOURCES,
    ADD_APP_TO_SOURCE,
    UNDO_ADD_SOURCE,
    CLEAR_ADD_SOURCE,
    SET_COUNT,
    ADD_HIDDEN_SOURCE,
    CLEAR_FILTERS
} from './actions-types';

export const defaultSourcesState = {
    loaded: 0,
    pageSize: 50,
    pageNumber: 1,
    entities: [],
    numberOfEntities: 0,
    appTypesLoaded: false,
    sourceTypesLoaded: false,
    addSourceInitialValues: {},
    filterValue: {},
    sortBy: 'created_at',
    sortDirection: 'desc'
};

export const entitiesPending = (state, { options }) => ({
    ...state,
    loaded: state.loaded + 1,
    paginationClicked: false,
    ...options
});

export const entitiesLoaded = (state, { payload: rows, options }) => ({
    ...state,
    loaded: Math.max(state.loaded - 1, 0),
    entities: rows,
    ...options
});

export const entitiesRejected = (state, { payload: { error } }) => ({
    ...state,
    fetchingError: error
});

export const sourceTypesPending = (state) => ({
    ...state,
    sourceTypes: [],
    sourceTypesLoaded: false
});

export const sourceTypesLoaded = (state, { payload: sourceTypes }) => ({
    ...state,
    sourceTypes,
    sourceTypesLoaded: true
});

export const appTypesPending = (state) => ({
    ...state,
    appTypes: [],
    appTypesLoaded: false
});

export const appTypesLoaded = (state, { payload: appTypes }) => ({
    ...state,
    appTypes,
    appTypesLoaded: true
});

export const sortEntities = (state, { payload: { column, direction } }) => ({
    ...state,
    sortBy: column,
    sortDirection: direction
});

export const setPageAndSize = (state, { payload: { page, size } }) => ({
    ...state,
    pageSize: size,
    pageNumber: page
});

export const filterSources = (state, { payload: { value } }) =>({
    ...state,
    filterValue: {
        ...state.filterValue,
        ...value
    },
    pageNumber: 1
});

export const sourceEditRemovePending = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? { ...entity, isDeleting: true } : entity)
});

export const sourceEditRemoveFulfilled = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? undefined : entity).filter(x => x)
});

export const sourceEditRemoveRejected = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? { ...entity, isDeleting: undefined } : entity)
});

export const appRemovingPending = (state, { meta }) => ({
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

export const appRemovingFulfilled = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ?
        {
            ...entity,
            applications: entity.applications.filter((app) => app.id !== meta.appId)
        }
        : entity)
});

export const appRemovingRejected = (state, { meta }) => ({
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

export const addAppToSource = (state, { payload: { sourceId, app } }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === sourceId ?
        {
            ...entity,
            applications: [...entity.applications, app]
        }
        : entity)
});

export const undoAddSource = (state, { payload: { values } }) => ({
    ...state,
    addSourceInitialValues: values
});

export const clearAddSource = (state) => ({
    ...state,
    addSourceInitialValues: {}
});

export const setCount = (state, { payload: { count } }) => ({
    ...state,
    numberOfEntities: count
});

export const addHiddenSource = (state, { payload: { source } }) => ({
    ...state,
    entities: [
        ...state.entities,
        { ...source, hidden: true }
    ]
});

export const clearFilters = (state) =>({
    ...state,
    filterValue: {},
    pageNumber: 1
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
    [FILTER_SOURCES]: filterSources,
    [ADD_APP_TO_SOURCE]: addAppToSource,
    [UNDO_ADD_SOURCE]: undoAddSource,
    [CLEAR_ADD_SOURCE]: clearAddSource,
    [ADD_APP_TO_SOURCE]: addAppToSource,
    [SET_COUNT]: setCount,
    [ADD_HIDDEN_SOURCE]: addHiddenSource,
    [CLEAR_FILTERS]: clearFilters
};
