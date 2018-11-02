import { ACTION_TYPES, CREATE_SOURCE, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES, PAGE_AND_SIZE, ADD_PROVIDER, FILTER_PROVIDERS, CLOSE_ALERT, ADD_ALERT } from '../action-types-providers';
import { sortList, paginateList, filterList } from '../../Utilities/listHelpers'
import flow from "lodash/fp/flow";

export const defaultProvidersState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1, // PF numbers pages from 1. Seriously.
    numberOfEntities: 0,
};

const entitiesPending = (state) => ({
    ...state,
    loaded: false,
    expanded: null,
})

const processList = (state) => {
    const filtered = filterList(state.rows, state.filterColumn, state.filterValue);

    return {
        length: filtered.length,
        list: flow(
            l => sortList(l, state.sortBy, state.sortDirection),
            l => paginateList(l, state.pageNumber, state.pageSize)
        )(filtered)
    }
}

const processListInState = (state) => {
    const { length, list } = processList(state)

    return {
        ...state,
        entities: list,
        numberOfEntities: length
    }
}

const entitiesLoaded = (state, { payload: rows }) => {
    console.log('R: entitiesLoaded');
    return processListInState({
        ...state,
        loaded: true,
        rows,
    });
}

const selectEntity = (state, { payload: { id, selected } }) => {
    console.log('R: selectEntity', id, selected);
    return {
        ...state,
        entities: state.entities.map(entity =>
            entity.id == id ? {...entity, selected} : entity
        )
    }
}

const expandEntity = (state, { payload: { id, expanded } }) => {
    console.log('R: expandEntity', id, expanded);
    return {
        ...state,
        entities: state.entities.map(entity =>
            (entity.id == id) ? {...entity, expanded: !entity.expanded} : entity
        )
    }
}

const sortEntities = (state, { payload: { column, direction } }) =>
    processListInState({
        ...state,
        sortBy: column,
        sortDirection: direction
    })

const setPageAndSize = (state, { payload: { page, size } }) =>  {
    console.log('R: setPageAndSize', page, size);
    return processListInState({
        ...state,
        pageSize: size,
        pageNumber: page,
    });
}

const addProvider = (state, { payload: { formData } }) => {
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

const filterProviders = (state, { payload: { column, value } }) => {
    console.log('R: filterProviders', column, value);
    return processListInState({
        ...state,
        filterColumn: column,
        filterValue: value,
        pageNumber: 1,
    })
}

const closeAlert = (state) => ({
    ...state,
    alert: null
})

const addAlert = (state, { payload: { message, type } }) => ({
    ...state,
    alert: {
        message,
        type,
    }
})

const createSourcePending = (state) => ({
    ...state,
    created: false,
})

const createSourceFulFilled = (state, { payload }) => {
    const createData = payload;
    console.log('R: createSourceFulFilled');

    return processListInState({
        ...state,
        created: true,
    });
}

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
//    [ACTION_TYPES.CREATE_SOURCE_PENDING]: createSourcePending,
//    [ACTION_TYPES.CREATE_SOURCE_FULFILLED]: createSourceFulFilled,

    [SELECT_ENTITY]: selectEntity,
    [EXPAND_ENTITY]: expandEntity,
    [SORT_ENTITIES]: sortEntities,
    [PAGE_AND_SIZE]: setPageAndSize,
    [ADD_PROVIDER]: addProvider,
    [FILTER_PROVIDERS]: filterProviders,
    [CLOSE_ALERT]: closeAlert,
    [ADD_ALERT]: addAlert,
};
