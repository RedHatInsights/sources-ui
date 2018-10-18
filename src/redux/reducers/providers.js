import { ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES, PAGE_AND_SIZE, ADD_PROVIDER, FILTER_PROVIDERS, CLOSE_ALERT } from '../action-types-providers';
import { sortList, paginateList, filterList } from '../../Utilities/listHelpers'

export const defaultProvidersState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1, // PF numbers pages from 1. Seriously.
    numberOfEntities: 0,
};

function entitiesPending(state) {
    return {
        ...state,
        loaded: false,
        expanded: null,
    };
}

function processList(state) {
    const processedList = paginateList(
        sortList(
            filterList(state.rows, state.filterColumn, state.filterValue),
            state.sortBy, state.sortDirection),
        state.pageNumber, state.pageSize
    );

    return {
        ...state,
        entities: processedList,
        numberOfEntities: filterList(state.rows, state.filterColumn, state.filterValue).length
    }
}

function entitiesLoaded(state, { payload }) {
    const rows = payload;
    console.log('R: entitiesLoaded');

    return processList({
        ...state,
        loaded: true,
        rows: rows,
    });
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

function sortEntities(state, { payload: { column, direction } }) {
    return processList({
        ...state,
        sortBy: column,
        sortDirection: direction
    });
}

function setPageAndSize(state, { payload: { page, size } }) {
    console.log('R: setPageAndSize', page, size);

    return processList({
        ...state,
        pageSize: size,
        pageNumber: page,
    });
}

function addProvider(state, { payload: { formData } }) {
    console.log('R: addProvider', formData);

    return {
        ...state,
        // for now just add an alert
        alert: {
            message: 'New source was succesfully added.',
            type: 'success',
        }
    }
}

function filterProviders(state, { payload: { column, value } }) {
    console.log('R: filterProviders', column, value);
    return processList({
        ...state,
        filterColumn: column,
        filterValue: value,
        pageNumber: 1,
    })
}

function closeAlert(state) {
    return {
        ...state,
        alert: null
    }
}

function addAlert(state, { payload: { message, type } }) {
    return {
        ...state,
        alert: {
            message,
            type,
        }
    }
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [SELECT_ENTITY]: selectEntity,
    [EXPAND_ENTITY]: expandEntity,
    [SORT_ENTITIES]: sortEntities,
    [PAGE_AND_SIZE]: setPageAndSize,
    [ADD_PROVIDER]: addProvider,
    [FILTER_PROVIDERS]: filterProviders,
    [CLOSE_ALERT]: closeAlert,
};
