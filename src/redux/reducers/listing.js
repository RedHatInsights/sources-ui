import { LOAD_LISTING_DATA, SORT_LISTING_DATA, PAGE_AND_SIZE_LISTING_DATA } from '../action-types-listing';
import { sortList, paginateList } from '../../Utilities/listHelpers'

export const defaultListingState = {
    loaded: false,
    pageSize: 10,
    pageNumber: 1, // PF numbers pages from 1. Seriously.
};

function loadListingData(state, { payload }) {
    return {
        ...state,
        listingRows: paginateList(
            sortList(payload, state.sortColumn, state.sortDirection),
            state.pageNumber, state.pageSize
        ),
        rawRows: payload,
        pageNumber: 1,
        pageSize: 10
    }
}

function sortListingData(state, { payload: { column, direction } }) {
    return {
        ...state,
        listingRows: paginateList(
            sortList(state.rawRows, column, direction),
            state.pageNumber, state.pageSize
        ),
        sortBy: column,
        sortDirection: direction
    }
}

function setPageAndSize(state, { payload: { page, size } }) {
    return {
        ...state,
        listingRows: paginateList(
          sortList(state.rawRows, state.sortBy, state.sortDirection),
          page, size
        ),
        pageSize: size,
        pageNumber: page,
    }
}

export default {
    [LOAD_LISTING_DATA]: loadListingData,
    [SORT_LISTING_DATA]: sortListingData,
    [PAGE_AND_SIZE_LISTING_DATA]: setPageAndSize,
};
