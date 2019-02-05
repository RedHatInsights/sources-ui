import { ASYNC_ACTION_TYPES, SORT_LISTING_DATA, PAGE_AND_SIZE_LISTING_DATA } from '../action-types-listing';
import { doLoadListingData } from '../../api/listing_view';

export const loadListingData = (viewDefinition, sourceId) => ({
    type: ASYNC_ACTION_TYPES.LOAD_LISTING_DATA,
    payload: doLoadListingData(viewDefinition, sourceId)
});

export const sortListingData = (column, direction) => ({
    type: SORT_LISTING_DATA,
    payload: { column, direction }
});

export const pageAndSize = (page, size) => ({
    type: PAGE_AND_SIZE_LISTING_DATA,
    payload: { page, size }
});
