import {
  ACTION_TYPES,
  ADD_APP_TO_SOURCE,
  ADD_HIDDEN_SOURCE,
  CLEAR_FILTERS,
  FILTER_SOURCES,
  PAGE_AND_SIZE,
  SET_CATEGORY,
  SET_COUNT,
  SORT_ENTITIES,
  STATUS_CHECK_PENDING,
} from './actionTypes';
import { CLOUD_VENDOR } from '../../utilities/constants';

export const defaultSourcesState = {
  loaded: 0,
  pageSize: 50,
  pageNumber: 1,
  entities: [],
  numberOfEntities: 0,
  appTypesLoaded: false,
  sourceTypesLoaded: false,
  filterValue: {},
  sortBy: 'created_at',
  sortDirection: 'desc',
  removingSources: [],
  activeCategory: CLOUD_VENDOR,
  appTypes: [],
  sourceTypes: [],
};

export const entitiesPending = (state, { options }) => ({
  ...state,
  loaded: state.loaded + 1,
  paginationClicked: false,
  ...options,
});

export const entitiesLoaded = (state, { payload: { sources, meta }, options }) => ({
  ...state,
  loaded: Math.max(state.loaded - 1, 0),
  entities: sources,
  numberOfEntities: meta?.count,
  ...options,
});

export const entitiesRejected = (state, { payload: { error } }) => ({
  ...state,
  fetchingError: error,
});

export const sourceTypesPending = (state) => ({
  ...state,
  sourceTypes: [],
  sourceTypesLoaded: false,
});

export const sourceTypesRejected = (state, { payload: { error } }) => ({
  ...state,
  fetchingError: error,
});

export const sourceTypesLoaded = (state, { payload: sourceTypes }) => ({
  ...state,
  sourceTypes,
  sourceTypesLoaded: true,
});

export const appTypesPending = (state) => ({
  ...state,
  appTypes: [],
  appTypesLoaded: false,
});

export const appTypesLoaded = (state, { payload: appTypes }) => ({
  ...state,
  appTypes,
  appTypesLoaded: true,
});

export const appTypesRejected = (state, { payload: { error } }) => ({
  ...state,
  fetchingError: error,
});

export const sortEntities = (state, { payload: { column, direction } }) => ({
  ...state,
  sortBy: column,
  sortDirection: direction,
});

export const setPageAndSize = (state, { payload: { page, size } }) => ({
  ...state,
  pageSize: size,
  pageNumber: page,
});

export const filterSources = (state, { payload: { value } }) => ({
  ...state,
  filterValue: {
    ...state.filterValue,
    ...value,
  },
  pageNumber: 1,
});

export const sourceEditRemovePending = (state, { meta }) => ({
  ...state,
  removingSources: [...state.removingSources, meta.sourceId],
});

export const sourceEditRemoveFulfilled = (state, { meta }) => ({
  ...state,
  removingSources: state.removingSources.filter((id) => id !== meta.sourceId),
  entities: state.entities.filter((entity) => entity.id !== meta.sourceId),
});

export const sourceEditRemoveRejected = (state, { meta }) => ({
  ...state,
  removingSources: state.removingSources.filter((id) => id !== meta.sourceId),
});

export const appRemovingPending = (state, { meta }) => ({
  ...state,
  entities: state.entities.map((entity) =>
    entity.id === meta.sourceId
      ? {
          ...entity,
          applications: entity.applications.map((app) =>
            app.id === meta.appId
              ? {
                  ...app,
                  isDeleting: true,
                }
              : app
          ),
        }
      : entity
  ),
});

export const appRemovingFulfilled = (state, { meta }) => ({
  ...state,
  entities: state.entities.map((entity) =>
    entity.id === meta.sourceId
      ? {
          ...entity,
          applications: entity.applications.filter((app) => app.id !== meta.appId),
        }
      : entity
  ),
});

export const appRemovingRejected = (state, { meta }) => ({
  ...state,
  entities: state.entities.map((entity) =>
    entity.id === meta.sourceId
      ? {
          ...entity,
          applications: entity.applications.map((app) =>
            app.id === meta.appId
              ? {
                  ...app,
                  isDeleting: undefined,
                }
              : app
          ),
        }
      : entity
  ),
});

export const addAppToSource = (state, { payload: { sourceId, app } }) => ({
  ...state,
  entities: state.entities.map((entity) =>
    entity.id === sourceId
      ? {
          ...entity,
          applications: [...entity.applications, app],
        }
      : entity
  ),
});

export const setCount = (state, { payload: { count } }) => ({
  ...state,
  numberOfEntities: count,
});

export const addHiddenSource = (state, { payload: { source } }) => ({
  ...state,
  entities: [...state.entities, { ...source, hidden: true }],
});

export const clearFilters = (state) => ({
  ...state,
  filterValue: {},
  pageNumber: 1,
});

export const sourceRenamePending = (state, { payload: { id, name } }) => ({
  ...state,
  entities: state.entities.map((entity) =>
    entity.id === id
      ? {
          ...entity,
          name,
        }
      : entity
  ),
});

export const sourceStatusCheckPending = (state, { payload: { sourceId } }) => ({
  ...state,
  entities: state.entities.map((entity) =>
    entity.id === sourceId
      ? {
          ...entity,
          isCheckPending: true,
        }
      : entity
  ),
});

const setCategory = (state, { payload: { category } }) => ({
  ...state,
  filterValue: {
    ...state.filterValue,
    source_type_id: [],
    applications: [],
  },
  activeCategory: category,
});

export default {
  [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
  [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
  [ACTION_TYPES.LOAD_ENTITIES_REJECTED]: entitiesRejected,
  [ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING]: sourceTypesPending,
  [ACTION_TYPES.LOAD_SOURCE_TYPES_FULFILLED]: sourceTypesLoaded,
  [ACTION_TYPES.LOAD_SOURCE_TYPES_REJECTED]: sourceTypesRejected,
  [ACTION_TYPES.LOAD_APP_TYPES_PENDING]: appTypesPending,
  [ACTION_TYPES.LOAD_APP_TYPES_FULFILLED]: appTypesLoaded,
  [ACTION_TYPES.LOAD_APP_TYPES_REJECTED]: appTypesRejected,
  [ACTION_TYPES.REMOVE_SOURCE_PENDING]: sourceEditRemovePending,
  [ACTION_TYPES.REMOVE_SOURCE_FULFILLED]: sourceEditRemoveFulfilled,
  [ACTION_TYPES.REMOVE_SOURCE_REJECTED]: sourceEditRemoveRejected,
  [ACTION_TYPES.REMOVE_APPLICATION_PENDING]: appRemovingPending,
  [ACTION_TYPES.REMOVE_APPLICATION_FULFILLED]: appRemovingFulfilled,
  [ACTION_TYPES.REMOVE_APPLICATION_REJECTED]: appRemovingRejected,
  [ACTION_TYPES.RENAME_SOURCE_PENDING]: sourceRenamePending,
  [ACTION_TYPES.RENAME_SOURCE_REJECTED]: sourceRenamePending,

  [SORT_ENTITIES]: sortEntities,
  [PAGE_AND_SIZE]: setPageAndSize,
  [FILTER_SOURCES]: filterSources,
  [ADD_APP_TO_SOURCE]: addAppToSource,
  [ADD_APP_TO_SOURCE]: addAppToSource,
  [SET_COUNT]: setCount,
  [ADD_HIDDEN_SOURCE]: addHiddenSource,
  [STATUS_CHECK_PENDING]: sourceStatusCheckPending,
  [CLEAR_FILTERS]: clearFilters,
  [SET_CATEGORY]: setCategory,
};
