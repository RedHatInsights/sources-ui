import { ACTION_TYPES, SELECT_ENTITY } from '../action-types';
import get from 'lodash/get';
import orderBy from 'lodash/orderBy';

export const defaultState = { loaded: false };

function entitiesPending(state) {
    return {
        ...state,
        loaded: false,
    };
}

function entitiesLoaded(state, { payload }) {
    const entities = payload;
    return {
        ...state,
        loaded: true,
        rows: entities,
        entities // filtered & sorted data
    }
}

function selectEntity(state, { payload: { id, selected } }) {
    console.log('selectEntity', id, selected);

    return {
        ...state,
        entities: state.entities.map(entity => {
            if (entity.id == id) return {...entity, selected}
            return entity;
        })
    }
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [SELECT_ENTITY]: selectEntity
};
