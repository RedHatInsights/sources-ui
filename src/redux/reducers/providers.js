import {
    ACTION_TYPES,
    SORT_ENTITIES,
    PAGE_AND_SIZE,
    FILTER_PROVIDERS,
    ADD_APP_TO_SOURCE,
    UNDO_ADD_SOURCE,
    CLEAR_ADD_SOURCE,
    SET_COUNT,
    ADD_HIDDEN_SOURCE
} from '../action-types-providers';

export const defaultProvidersState = {
    loaded: false,
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

const entitiesPending = (state, { options }) => ({
    ...state,
    loaded: false,
    ...options
});

export const entitiesLoaded = (state, { payload: rows, options }) => ({
    ...state,
    loaded: true,
    entities: rows,
    ...options
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

export const filterProviders = (state, { payload: { value } }) =>({
    ...state,
    filterValue: {
        ...state.filterValue,
        ...value
    },
    pageNumber: 1
});

const sourceEditRemovePending = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? { ...entity, isDeleting: true } : entity)
});

const sourceEditRemoveFulfilled = (state, { meta }) => ({
    ...state,
    entities: state.entities.map(entity => entity.id === meta.sourceId ? undefined : entity).filter(x => x)
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

export const undoAddSource = (state, { payload: { values } }) => ({
    ...state,
    addSourceInitialValues: values
});

export const clearAddSource = (state) => ({
    ...state,
    addSourceInitialValues: {}
});

const setCount = (state, { payload: { count } }) => ({
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
    [ADD_APP_TO_SOURCE]: addAppToSource,
    [UNDO_ADD_SOURCE]: undoAddSource,
    [CLEAR_ADD_SOURCE]: clearAddSource,
    [ADD_APP_TO_SOURCE]: addAppToSource,
    [SET_COUNT]: setCount,
    [ADD_HIDDEN_SOURCE]: addHiddenSource
};
