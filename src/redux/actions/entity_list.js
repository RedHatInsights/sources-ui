import { ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES, PAGE_AND_SIZE } from '../action-types';
import { getEntities } from '../../api/entities';

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
