import {
    ACTION_TYPES, SELECT_ENTITY, EXPAND_ENTITY, SORT_ENTITIES,
    PAGE_AND_SIZE, ADD_PROVIDER, FILTER_PROVIDERS, SET_FILTER_COLUMN,
    SOURCE_EDIT_REQUEST, SOURCE_FOR_EDIT_LOADED
} from '../action-types-providers';
import { processList } from '../../Utilities/listHelpers';

export const defaultProvidersState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1, // PF numbers pages from 1. Seriously.
    entities: [],
    numberOfEntities: 0,
    filterColumn: 'name' // temporary hard-coded filtering by name
};

const processListInState = (state) => {
    const { length, list } = processList(state.rows, state);

    return {
        ...state,
        entities: list,
        numberOfEntities: length
    };
};

const entitiesPending = (state) => ({
    ...state,
    loaded: false,
    expanded: null
});

const entitiesLoaded = (state, { payload: { data: rows } }) =>
    processListInState({
        ...state,
        loaded: true,
        rows
    });

const sourceTypesPending = (state) => ({
    ...state,
    sourceTypes: []
});

const sourceTypesLoaded = (state, { payload: sourceTypes }) => ({
    ...state,
    sourceTypes
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

const filterProviders = (state, { payload: { value } }) =>
    processListInState({
        ...state,
        filterValue: value,
        pageNumber: 1
    });

const setFilterColumn = (state, { payload: { column } }) =>
    processListInState({
        ...state,
        filterColumn: column,
        pageNumber: 1
    });

const sourceForEditLoaded = (state, { payload }) => ({
    ...state,
    source: payload
});

const sourceEditRequest = (state) => ({
    ...state,
    source: null
});

export default {
    [ACTION_TYPES.LOAD_ENTITIES_PENDING]: entitiesPending,
    [ACTION_TYPES.LOAD_ENTITIES_FULFILLED]: entitiesLoaded,
    [ACTION_TYPES.LOAD_SOURCE_TYPES_PENDING]: sourceTypesPending,
    [ACTION_TYPES.LOAD_SOURCE_TYPES_FULFILLED]: sourceTypesLoaded,

    [SELECT_ENTITY]: selectEntity,
    [EXPAND_ENTITY]: expandEntity,
    [SORT_ENTITIES]: sortEntities,
    [PAGE_AND_SIZE]: setPageAndSize,
    [ADD_PROVIDER]: addProvider,
    [FILTER_PROVIDERS]: filterProviders,
    [SET_FILTER_COLUMN]: setFilterColumn,
    [SOURCE_FOR_EDIT_LOADED]: sourceForEditLoaded,
    [SOURCE_EDIT_REQUEST]: sourceEditRequest
};
