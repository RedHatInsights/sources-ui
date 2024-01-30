import React from 'react';

import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';

import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications/redux';
import {
  ACTION_TYPES,
  ADD_APP_TO_SOURCE,
  ADD_HIDDEN_SOURCE,
  CLEAR_FILTERS,
  FILTER_SOURCES,
  PAGE_AND_SIZE,
  SET_CATEGORY,
  SORT_ENTITIES,
  STATUS_CHECK_PENDING,
} from './actionTypes';
import { doDeleteApplication, doLoadAppTypes, doLoadEntities, doRemoveSource, getSourcesApi } from '../../api/entities';
import { doLoadSourceTypes } from '../../api/source_types';
import { bold } from '../../utilities/intlShared';
import handleError from '../../api/handleError';
import tryAgainMessage from '../../utilities/tryAgainMessage';
import { checkAccountHCS } from '../../api/checkAccountHCS';
import { INTEGRATIONS } from '../../utilities/constants';

export const loadEntities = (options) => (dispatch, getState) => {
  dispatch({
    type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
    options: typeof options === 'function' ? options(getState) : options,
  });

  const { pageSize, pageNumber, sortBy, sortDirection, filterValue, activeCategory } = getState().sources;

  return doLoadEntities({
    pageSize,
    pageNumber,
    sortBy,
    sortDirection,
    filterValue,
    activeCategory,
  })
    .then(({ sources, meta }) =>
      dispatch({
        type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
        payload: { sources, meta },
      }),
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
      }),
    );
};

export const loadSourceTypes = () => (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING });

  return doLoadSourceTypes()
    .then((sourceTypes) =>
      dispatch({
        type: ACTION_TYPES.LOAD_SOURCE_TYPES_FULFILLED,
        payload: sourceTypes,
      }),
    )
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.LOAD_SOURCE_TYPES_REJECTED,
        payload: { error },
        meta: { noError: true },
      }),
    );
};

export const loadHcsEnrollment = (token, isProd) => (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOAD_HCS_ENROLLMENT_PENDING });

  return checkAccountHCS(token, isProd)
    .then(({ hcsDeal }) =>
      dispatch({
        type: ACTION_TYPES.LOAD_HCS_ENROLLMENT_FULFILLED,
        payload: hcsDeal,
      }),
    )
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.LOAD_HCS_ENROLLMENT_REJECTED,
        payload: { error },
        meta: { noError: true },
      }),
    );
};

export const loadAppTypes = () => (dispatch) => {
  dispatch({ type: ACTION_TYPES.LOAD_APP_TYPES_PENDING });

  return doLoadAppTypes()
    .then((appTypes) =>
      dispatch({
        type: ACTION_TYPES.LOAD_APP_TYPES_FULFILLED,
        payload: appTypes.data,
      }),
    )
    .catch((error) =>
      dispatch({
        type: ACTION_TYPES.LOAD_APP_TYPES_REJECTED,
        payload: { error },
        meta: { noError: true },
      }),
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
      }),
    );
};

export const removeMessage = (id) => ({
  type: REMOVE_NOTIFICATION,
  payload: id,
});

export const removeApplication = (appId, sourceId, successTitle, errorTitle) => ({
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

export const setCheckPenging = (sourceId) => ({
  type: STATUS_CHECK_PENDING,
  payload: {
    sourceId,
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
      }),
    );
};

export const setActiveCategory = (category) => (dispatch) => {
  dispatch({
    type: SET_CATEGORY,
    payload: { category },
  });

  return category !== INTEGRATIONS && dispatch(loadEntities({ pageNumber: 1 }));
};

export const pauseSource = (sourceId, sourceName, intl) => (dispatch) => {
  return getSourcesApi()
    .pauseSource(sourceId)
    .then(() => {
      dispatch(
        addMessage({
          title: intl.formatMessage({ id: 'source.paused.alert.title', defaultMessage: 'Source paused' }),
          description: intl.formatMessage(
            {
              id: 'source.paused.alert.description',
              defaultMessage:
                'Source <b>{ sourceName }</b> is now paused. Data collection for all connected applications will be disabled until the source is resumed.',
            },
            { sourceName, b: bold },
          ),
          variant: 'default',
          customIcon: <PauseIcon />,
        }),
      );
      dispatch(loadEntities({ loaded: 0 }));
    })
    .catch((error) => {
      dispatch(
        addMessage({
          title: intl.formatMessage({ id: 'source.paused.alert.error', defaultMessage: 'Source pause failed' }),
          description: tryAgainMessage(intl, handleError(error)),
          variant: 'danger',
        }),
      );
    });
};

export const resumeSource = (sourceId, sourceName, intl) => (dispatch) => {
  return getSourcesApi()
    .unpauseSource(sourceId)
    .then(() => {
      dispatch(
        addMessage({
          title: intl.formatMessage({ id: 'source.resumed.alert.title', defaultMessage: 'Source resumed' }),
          description: intl.formatMessage(
            {
              id: 'source.resumed.alert.description',
              defaultMessage: 'Source <b>{ sourceName }</b> will recontinue data collection for connected applications.',
            },
            { sourceName, b: bold },
          ),
          variant: 'default',
          customIcon: <PlayIcon />,
        }),
      );
      dispatch(loadEntities({ loaded: 0 }));
    })
    .catch((error) => {
      dispatch(
        addMessage({
          title: intl.formatMessage({ id: 'source.resume.alert.error', defaultMessage: 'Source resume failed' }),
          description: tryAgainMessage(intl, handleError(error)),
          variant: 'danger',
        }),
      );
    });
};
