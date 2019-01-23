import {
    ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES,
    PAGE_AND_SIZE, ADD_PROVIDER, FILTER_PROVIDERS//, CLOSE_ALERT, ADD_ALERT
} from '../action-types-providers';
import { processList } from '../../Utilities/listHelpers';

export const defaultProvidersState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1, // PF numbers pages from 1. Seriously.
    numberOfEntities: 0
};

const entitiesPending = (state) => ({
    ...state,
    loaded: false,
    expanded: null
});

const processListInState = (state) => {
    const { length, list } = processList(state.rows, state);

    return {
        ...state,
        entities: list,
        numberOfEntities: length
    };
};

const entitiesLoaded = (state, { payload: rows }) =>
    processListInState({
        ...state,
        loaded: true,
        rows
    });

const selectEntity = (state, { payload: { id, selected } }) => ({
    ...state,
    entities: state.entities.map(entity =>
        entity.id === id ? { ...entity, selected } : entity
    )
});

const expandEntity = (state, { payload: { id, _expanded } }) => ({
    ...state,
    entities: state.entities.map(entity =>
        (entity.id === id) ? { ...entity, expanded: !entity.expanded } : entity
    )
});

const sortEntities = (state, { payload: { column, direction } }) =>
    processListInState({
        ...state,
        sortBy: column,
        sortDirection: direction
    });

const setPageAndSize = (state, { payload: { page, size } }) =>
    processListInState({
        ...state,
        pageSize: size,
        pageNumber: page
    });

const addProvider = (state, { payload: { formData } }) => {
    console.log('R: addProvider', formData);
    return {
        ...state,
        // for now just add an alert
        alert: {
            message: 'New source was succesfully added.',
            type: 'success'
        }
    };
};

const filterProviders = (state, { payload: { column, value } }) =>
    processListInState({
        ...state,
        filterColumn: column,
        filterValue: value,
        pageNumber: 1
    });

/*
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
    created: false
});

const createSourceFulFilled = (state, { payload }) => {
    const createData = payload;
    console.log('R: createSourceFulFilled');

    return processListInState({
        ...state,
        created: true
    });
};
*/

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
    [FILTER_PROVIDERS]: filterProviders
//    [CLOSE_ALERT]: closeAlert,
//    [ADD_ALERT]: addAlert,
};
