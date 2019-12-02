import { ADD_NOTIFICATION, REMOVE_NOTIFICATION } from '@redhat-cloud-services/frontend-components-notifications';
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
import {
    doLoadAppTypes,
    doRemoveSource,
    doLoadEntities,
    doDeleteApplication,
    doLoadCountOfSources
} from '../../api/entities';
import { doUpdateSource } from '../../api/doUpdateSource';
import { doLoadSourceTypes } from '../../api/source_types';

export const loadEntities = (options) => (dispatch, getState) => {
    dispatch({
        type: ACTION_TYPES.LOAD_ENTITIES_PENDING,
        options
    });

    const { pageSize, pageNumber, sortBy, sortDirection, filterValue } = getState().providers;

    return Promise.all([
        doLoadEntities({ pageSize, pageNumber, sortBy, sortDirection, filterValue }),
        doLoadCountOfSources(filterValue).then(({ meta: { count } }) => dispatch({ type: SET_COUNT, payload: { count } }))
    ]).then(([{ sources }]) => dispatch({
        type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
        payload: sources
    })).catch(error => dispatch({
        type: ACTION_TYPES.LOAD_ENTITIES_REJECTED,
        payload: { error: { detail: error.detail || error.data, title: 'Fetching data failed, try refresh page' } }
    }));
};

export const loadSourceTypes = () => (dispatch) => {
    dispatch({ type: ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING });

    return doLoadSourceTypes().then(sourceTypes => dispatch({
        type: ACTION_TYPES.LOAD_SOURCE_TYPES_FULFILLED,
        payload: sourceTypes
    }));
};

export const loadAppTypes = () => (dispatch) => {
    dispatch({ type: ACTION_TYPES.LOAD_APP_TYPES_PENDING });

    return doLoadAppTypes().then(appTypes => dispatch({
        type: ACTION_TYPES.LOAD_APP_TYPES_FULFILLED,
        payload: appTypes.data
    }));
};

export const sortEntities = (column, direction) => (dispatch) => {
    dispatch({
        type: SORT_ENTITIES,
        payload: { column, direction }
    });

    return dispatch(loadEntities());
};

export const pageAndSize = (page, size) => (dispatch) => {
    dispatch({
        type: PAGE_AND_SIZE,
        payload: { page, size }
    });

    return dispatch(loadEntities());
};

export const filterProviders = (value) => ({
    type: FILTER_PROVIDERS,
    payload: { value }
});

export const updateSource = (source, formData, title, description, errorTitles) => (dispatch) =>
    doUpdateSource(source, formData, errorTitles).then(_finished => dispatch({
        type: ADD_NOTIFICATION,
        payload: {
            variant: 'success',
            title,
            description,
            dismissable: true
        }
    })).catch(error => dispatch({
        type: 'FOOBAR_REJECTED',
        payload: error
    }));

export const addMessage = (title, variant, description, customId) => (dispatch) => dispatch({
    type: ADD_NOTIFICATION,
    payload: {
        title,
        variant,
        description,
        dismissable: true,
        customId
    }
});

export const removeSource = (sourceId, title) => (dispatch) => {
    dispatch({
        type: ACTION_TYPES.REMOVE_SOURCE_PENDING,
        meta: {
            sourceId
        }
    });

    return doRemoveSource(sourceId).then(() => dispatch(loadEntities({ loaded: true })))
    .then(() => {
        dispatch({
            type: ACTION_TYPES.REMOVE_SOURCE_FULFILLED,
            meta: {
                sourceId
            }
        });
        dispatch(addMessage(title, 'success'));
    })
    .catch(() => dispatch({
        type: ACTION_TYPES.REMOVE_SOURCE_REJECTED,
        meta: {
            sourceId
        }
    }));
};

export const removeMessage = (id) => (dispatch) => dispatch({
    type: REMOVE_NOTIFICATION,
    payload: id
});

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
                    dismissable: true
                }
            }
        }
    });
};

export const addAppToSource = (sourceId, app) => ({
    type: ADD_APP_TO_SOURCE,
    payload: {
        sourceId,
        app
    }
});

export const undoAddSource = (values) => ({
    type: UNDO_ADD_SOURCE,
    payload: { values }
});

export const clearAddSource = () => ({
    type: CLEAR_ADD_SOURCE
});

export const addHiddenSource = (source) => ({
    type: ADD_HIDDEN_SOURCE,
    payload: {
        source
    }
});
