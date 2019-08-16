import { ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import {
    ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES, PAGE_AND_SIZE,
    ADD_PROVIDER, FILTER_PROVIDERS, CLOSE_ALERT, ADD_ALERT, SET_FILTER_COLUMN,
    SOURCE_FOR_EDIT_LOADED, SOURCE_EDIT_REQUEST
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
    });
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

export const selectEntity = (id, selected) => ({
    type: SELECT_ENTITY,
    payload: { id, selected }
});

export const expandEntity = (id, expanded) => ({
    type: EXPAND_ENTITY,
    payload: { id, expanded }
});

export const sortEntities = (column, direction) => ({
    type: SORT_ENTITIES,
    payload: { column, direction }
});

export const pageAndSize = (page, size) => ({
    type: PAGE_AND_SIZE,
    payload: { page, size }
});

export const addProvider = (formData) => ({
    type: ADD_PROVIDER,
    payload: { formData }
});

export const filterProviders = (value) => ({
    type: FILTER_PROVIDERS,
    payload: { value }
});

export const setProviderFilterColumn = (column) => ({
    type: SET_FILTER_COLUMN,
    payload: { column }
});

export const closeAlert = () => ({
    type: CLOSE_ALERT
});

export const addAlert = (message, type) => ({
    type: ADD_ALERT,
    payload: { message, type }
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
