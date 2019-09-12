import { ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import {
    ACTION_TYPES,
    SORT_ENTITIES,
    PAGE_AND_SIZE,
    FILTER_PROVIDERS,
    SET_FILTER_COLUMN,
    SOURCE_FOR_EDIT_LOADED,
    SOURCE_EDIT_REQUEST
} from '../action-types-providers';
import {
    doLoadAppTypes,
    doLoadSourceForEdit,
    doRemoveSource,
    doUpdateSource,
    doLoadEntities
} from '../../api/entities';
import { doLoadSourceTypes } from '../../api/source_types';

export const loadEntities = () => (dispatch) => {
    dispatch({ type: ACTION_TYPES.LOAD_ENTITIES_PENDING });

    return doLoadEntities().then(({ sources }) => {
        dispatch({
            type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
            payload: sources
        });
    }).catch(error => dispatch({
        type: ACTION_TYPES.LOAD_ENTITIES_REJECTED,
        payload: { error: { detail: error.data, title: 'Fetching data failed, try refresh page' } }
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

export const sortEntities = (column, direction) => ({
    type: SORT_ENTITIES,
    payload: { column, direction }
});

export const pageAndSize = (page, size) => ({
    type: PAGE_AND_SIZE,
    payload: { page, size }
});

export const filterProviders = (value) => ({
    type: FILTER_PROVIDERS,
    payload: { value }
});

export const setProviderFilterColumn = (column) => ({
    type: SET_FILTER_COLUMN,
    payload: { column }
});

export const updateSource = (source, formData, title, description) => (dispatch) =>
    doUpdateSource(source, formData).then(_finished => dispatch({
        type: ADD_NOTIFICATION,
        payload: {
            variant: 'success',
            title,
            description
        }
    })).catch(error => dispatch({
        type: 'FOOBAR_REJECTED',
        payload: error
    }));

export const removeSource = (sourceId, title) => (dispatch) =>
    doRemoveSource(sourceId).then(_finished => dispatch({
        type: ADD_NOTIFICATION,
        payload: {
            variant: 'success',
            title
        }
    })).catch(error => dispatch({
        type: 'FOOBAR_REJECTED',
        payload: error
    }));

export const loadSourceForEdit = sourceId => dispatch => {
    dispatch({ type: SOURCE_EDIT_REQUEST });

    return doLoadSourceForEdit(sourceId).then(sourceData => dispatch({
        type: SOURCE_FOR_EDIT_LOADED,
        payload: sourceData
    })).catch(error => dispatch({
        type: 'FOOBAR_REJECTED',
        payload: error
    }));
};

export const addMessage = (title, variant, description) => (dispatch) => dispatch({
    type: ADD_NOTIFICATION,
    payload: {
        title,
        variant,
        description
    }
});
