import {
    ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES, PAGE_AND_SIZE,
    ADD_PROVIDER, FILTER_PROVIDERS, CLOSE_ALERT, ADD_ALERT
} from '../action-types-providers';
import { getEntities, doCreateSource } from '../../api/entities';

export const loadEntities = () => ({
    type: ACTION_TYPES.LOAD_ENTITIES,
    payload: getEntities()
});

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

export const filterProviders = (column, value) => ({
    type: FILTER_PROVIDERS,
    payload: { column, value }
});

export const closeAlert = () => ({
    type: CLOSE_ALERT
});

export const addAlert = (message, type) => ({
    type: ADD_ALERT,
    payload: { message, type }
});

export const createSource = (formData) => {
    return {
        type: ACTION_TYPES.CREATE_SOURCE,
        payload: doCreateSource(formData),
        meta: {
            notifications: {
                fulfilled: {
                    variant: 'success',
                    title: 'Source was created.',
                    description: 'The new source was successfully created.'
                }
            }
        }
    };
};
