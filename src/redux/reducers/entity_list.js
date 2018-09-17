import { ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES, PAGE_AND_SIZE } from '../action-types';
import get from 'lodash/get';
import drop from 'lodash/drop';
import take from 'lodash/take';
import orderBy from 'lodash/orderBy';
import lowerCase from 'lodash/lowerCase';

export const defaultState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1, // PF numbers pages from 1. Seriously.
};

function entitiesPending(state) {
    return {
        ...state,
        loaded: false,
        expanded: null,
    };
}

function entitiesLoaded(state, { payload }) {
    const rows = payload;
    return {
        ...state,
        loaded: true,
        rows: rows,
        entities: paginateList(
            sortList(rows, state.sortBy, state.sortDirection),
            state.pageNumber, state.pageSize
        ),
    }
}

function selectEntity(state, { payload: { id, selected } }) {
    console.log('R: selectEntity', id, selected);

    return {
        ...state,
        entities: state.entities.map(entity => {
            if (entity.id == id) return {...entity, selected}
            return entity;
        })
    }
}

function expandEntity(state, { payload: { id, expanded } }) {
    console.log('R: expandEntity', id, expanded);
    return {
        ...state,
        entities: state.entities.map(entity => {
            if (entity.id == id) return {...entity, expanded: !entity.expanded}
            return entity;
        })
    }
}

function sortList(list, column, direction) {
    if (! column) return list;

    return orderBy(
        list,
        [element => lowerCase(get(element, column))],
        [direction == 'up' ? 'desc' : 'asc']
    )
}

function paginateList(list, pageNumber, pageSize) {
    return take(
      drop(list, pageSize * (pageNumber - 1)),
      pageSize
    )
}

function sortEntities(state, { payload: { column, direction } }) {
    console.log('R: sortEntities', column, direction);
    console.log(get(state.rows[0], column))
    return {
        ...state,
        entities: paginateList(
          sortList(state.rows, column, direction),
          state.pageNumber, state.pageSize
        ),
        sortBy: column,
        sortDirection: direction
    }
}

function setPageAndSize(state, { payload: { page, size } }) {
    console.log('R: setPageAndSize', page, size);
    return {
        ...state,
        entities: paginateList(
          sortList(state.rows, state.sortBy, state.sortDirection),
          page, size
        ),
        pageSize: size,
        pageNumber: page,
    }
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [SELECT_ENTITY]: selectEntity,
    [EXPAND_ENTITY]: expandEntity,
    [SORT_ENTITIES]: sortEntities,
    [PAGE_AND_SIZE]: setPageAndSize
};
