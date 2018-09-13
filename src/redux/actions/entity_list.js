import { ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY } from '../action-types';
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
