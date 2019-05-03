import find from 'lodash/find';
import { ADD_NOTIFICATION } from '@red-hat-insights/insights-frontend-components/components/Notifications';
import {
    ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES, PAGE_AND_SIZE,
    ADD_PROVIDER, FILTER_PROVIDERS, CLOSE_ALERT, ADD_ALERT, SET_FILTER_COLUMN,
    SOURCE_FOR_EDIT_LOADED, SOURCE_EDIT_REQUEST
} from '../action-types-providers';
import {
    doCreateSource,
    doLoadApplications,
    doLoadAppTypes,
    doLoadEndpoints,
    doLoadSourceForEdit,
    doRemoveSource,
    doUpdateSource,
    getEntities,
    sourceTypeStrFromLocation
} from '../../api/entities';
import { doLoadSourceTypes } from '../../api/source_types';

const mergeSourcesOther = (sources, key, other) =>
    sources.map(s => ({ ...s, [key]: other.filter(o => o.source_id === s.id) }));

const mergeSourcesAndApps = (sources, apps) =>
    sources.map(s => ({ ...s, apps: apps.filter(a => a.source_id === s.id) }));

const mergeSourcesAndEndpoints = (sources, endpoints) =>
    sources.map(s => ({ ...s, endpoints: endpoints.filter(a => a.source_id === s.id) }));

export const loadEntities = () => (dispatch, getState) => {
    dispatch({ type: ACTION_TYPES.LOAD_ENTITIES_PENDING });

    // temporarily we limit the sources offered based on URL
    const sourceTypeStr = sourceTypeStrFromLocation();
    const sourceType = sourceTypeStr && find(getState().providers.sourceTypes, { name: sourceTypeStr });

    return getEntities({}, { prefixed: sourceType && sourceType.id }).then(sources => {
        const sourceIdsList = sources.data.map(s => s.id).join(',')

        Promise.all([
            doLoadEndpoints(sourceIdsList), doLoadApplications(sourceIdsList)
        ]).then(([endpoints, applications]) => {
            const merged = mergeSourcesAndEndpoints(mergeSourcesAndApps(sources.data, applications.data), endpoints.data);
            dispatch({
                type: ACTION_TYPES.LOAD_ENTITIES_FULFILLED,
                payload: merged
            });
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

const hardcodedSuccessMessage = {
    openshift: 'The resource in this source are now available in Catalog',
    aws: 'Additional recommendations based on these extra sources will now appear in Insights'
};

const successMessage = sourceType => (
    hardcodedSuccessMessage[sourceType] || 'The new source was successfully created.'
);

export const createSource = (formData, sourceTypes) => (dispatch) =>
    doCreateSource(formData, sourceTypes).then(_finished => dispatch({
        type: ADD_NOTIFICATION,
        payload: {
            variant: 'success',
            title: `${formData.source_name} was added successfully`,
            description: successMessage(formData.source_type)
        }
    })).catch(error => dispatch({
        type: 'FOOBAR_REJECTED',
        payload: error
    }));

export const updateSource = (source, formData) => (dispatch) =>
    doUpdateSource(source, formData).then(_finished => dispatch({
        type: ADD_NOTIFICATION,
        payload: {
            variant: 'success',
            title: `"${formData.source_name}" was modified successfully.`,
            description: 'The source was successfully modified.'
        }
    })).catch(error => dispatch({
        type: 'FOOBAR_REJECTED',
        payload: error
    }));

export const removeSource = (sourceId) => (dispatch) =>
    doRemoveSource(sourceId).then(_finished => dispatch({
        type: ADD_NOTIFICATION,
        payload: {
            variant: 'success',
            title: 'Source was removed.',
            description: 'The selected source was removed.'
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
