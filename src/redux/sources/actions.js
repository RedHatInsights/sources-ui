import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/cjs/actionTypes';
import {
  ACTION_TYPES,
  SORT_ENTITIES,
  PAGE_AND_SIZE,
  FILTER_SOURCES,
  ADD_APP_TO_SOURCE,
  SET_COUNT,
  ADD_HIDDEN_SOURCE,
  CLEAR_FILTERS,
  SET_VENDOR,
} from './actionTypes';
import {
  doLoadAppTypes,
  doRemoveSource,
  doLoadEntities,
  doDeleteApplication,
  doLoadCountOfSources,
  getSourcesApi,
} from '../../api/entities';
import { doLoadSourceTypes } from '../../api/source_types';

export const loadEntities = (options) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
    options,
  });

  const { pageSize, pageNumber, sortBy, sortDirection, filterValue, activeVendor } = getState().sources;

  return Promise.all([
    doLoadEntities({
      pageSize,
      pageNumber,
      sortBy,
      sortDirection,
      filterValue,
      activeVendor,
    }),
    doLoadCountOfSources(filterValue, activeVendor).then(({ meta: { count } }) =>
      dispatch({ type: SET_COUNT, payload: { count } })
    ),
  ])
    .then(([{ sources }]) =>
      dispatch({
        type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
        payload: sources,
      })
    )
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.LOAD_ENTITIES_REJECTED,
        meta: { noError: true },
        payload: {
          error: {
            detail: error.detail || error.data,
            title: error.title || 'Fetching data failed, try refresh page',
          },
        },
      })
    );
};

export const loadSourceTypes = () => (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING });

  return doLoadSourceTypes()
    .then((sourceTypes) =>
      dispatch({
        type: ACTION_TYPES.LOAD_SOURCE_TYPES_FULFILLED,
        payload: sourceTypes,
      })
    )
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.LOAD_SOURCE_TYPES_REJECTED,
        payload: { error },
        meta: { noError: true },
      })
    );
};

export const loadAppTypes = () => (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOAD_APP_TYPES_PENDING });

  return doLoadAppTypes()
    .then((appTypes) =>
      dispatch({
        type: ACTION_TYPES.LOAD_APP_TYPES_FULFILLED,
        payload: appTypes.data,
      })
    )
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.LOAD_APP_TYPES_REJECTED,
        payload: { error },
        meta: { noError: true },
      })
    );
};

export const sortEntities = (column, direction) => (dispatch) => {
  dispatch({
    type: SORT_ENTITIES,
    payload: { column, direction },
  });

  return dispatch(loadEntities());
};

export const pageAndSize = (page, size) => (dispatch) => {
  dispatch({
    type: PAGE_AND_SIZE,
    payload: { page, size },
  });

  return dispatch(loadEntities({ paginationClicked: true }));
};

export const filterSources = (value) => (dispatch) => {
  dispatch({
    type: FILTER_SOURCES,
    payload: { value },
  });

  return dispatch(loadEntities());
};

export const addMessage = (props) => (dispatch) =>
  dispatch({
    type: ADD_NOTIFICATION,
    payload: {
      dismissable: true,
      ...props,
    },
  });

export const removeSource = (sourceId, title) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.REMOVE_SOURCE_PENDING,
    meta: {
      sourceId,
    },
  });

  return doRemoveSource(sourceId)
    .then(() => dispatch(loadEntities({ loaded: 0 })))
    .then(() => {
      dispatch({
        type: ACTION_TYPES.REMOVE_SOURCE_FULFILLED,
        meta: {
          sourceId,
        },
      });
      dispatch(addMessage({ title, variant: 'success' }));
    })
    .catch(() =>
      dispatch({
        type: ACTION_TYPES.REMOVE_SOURCE_REJECTED,
        meta: {
          sourceId,
        },
      })
    );
};

export const removeMessage = (id) => (dispatch, getState) => {
  const messageId = getState().notifications.find(({ customId }) => customId === id)?.id;

  return dispatch({
    type: REMOVE_NOTIFICATION,
    payload: messageId,
  });
};

export const removeApplication = (appId, sourceId, successTitle, errorTitle) => (dispatch) => {
  dispatch({
    type: ACTION_TYPES.REMOVE_APPLICATION,
    payload: () => doDeleteApplication(appId, errorTitle),
    meta: {
      appId,
      sourceId,
      notifications: {
        fulfilled: {
          variant: 'success',
          title: successTitle,
          dismissable: true,
        },
      },
    },
  });
};

export const addAppToSource = (sourceId, app) => ({
  type: ADD_APP_TO_SOURCE,
  payload: {
    sourceId,
    app,
  },
});

export const addHiddenSource = (source) => ({
  type: ADD_HIDDEN_SOURCE,
  payload: {
    source,
  },
});

export const clearFilters = () => (dispatch) => {
  dispatch({
    type: CLEAR_FILTERS,
  });

  return dispatch(loadEntities());
};

export const renameSource = (id, name, errorTitle) => (dispatch, getState) => {
  const oldName = getState().sources.entities.find((source) => source.id === id)?.name;

  dispatch({ type: ACTION_TYPES.RENAME_SOURCE_PENDING, payload: { id, name } });

  return getSourcesApi()
    .updateSource(id, { name })
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.RENAME_SOURCE_REJECTED,
        payload: { error: { detail: error.errors?.[0]?.detail || error, title: errorTitle }, id, name: oldName },
      })
    );
};

export const setActiveVendor = (vendor) => (dispatch) => {
  dispatch({
    type: SET_VENDOR,
    payload: { vendor },
  });

  return dispatch(loadEntities());
};
