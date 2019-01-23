import { ASYNC_ACTION_TYPES, SORT_LISTING_DATA, PAGE_AND_SIZE_LISTING_DATA } from '../action-types-listing';
import { sortList, paginateList } from '../../Utilities/listHelpers';

export const defaultListingState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1 // PF numbers pages from 1. Seriously.
};

function loadedListingData(state, { payload }) {
    return {
        ...state,
        loaded: true,
        listingRows: paginateList(
            sortList(payload, state.sortBy, state.sortDirection),
            state.pageNumber, state.pageSize
        ),
        rawRows: payload,
        pageNumber: 1,
        pageSize: 10
    };
}

function sortListingData(state, { payload: { column, direction } }) {
    console.log('sortListingData');
    console.log(column);
    return {
        ...state,
        listingRows: paginateList(
            sortList(state.rawRows, column, direction),
            state.pageNumber, state.pageSize
        ),
        sortBy: column,
        sortDirection: direction
    };
}

function setPageAndSize(state, { payload: { page, size } }) {
    return {
        ...state,
        listingRows: paginateList(
            sortList(state.rawRows, state.sortBy, state.sortDirection),
            page, size
        ),
        pageSize: size,
        pageNumber: page
    };
}

const listingPending = (state) => ({
    ...state,
    loaded: false
});

export default {
    [ASYNC_ACTION_TYPES.LOAD_LISTING_DATA_FULFILLED]: loadedListingData,
    [ASYNC_ACTION_TYPES.LOAD_LISTING_DATA_PENDING]: listingPending,
    [SORT_LISTING_DATA]: sortListingData,
    [PAGE_AND_SIZE_LISTING_DATA]: setPageAndSize
};
