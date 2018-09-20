import { LOAD_LISTING_DATA, SORT_LISTING_DATA, PAGE_AND_SIZE_LISTING_DATA } from '../action-types-listing';
import { generateRandomData } from '../../api/listing_view';

export const loadListingData = () => ({
    type: LOAD_LISTING_DATA,
    payload: generateRandomData(100)
});

export const sortListingData = (column, direction) => ({
    type: SORT_LISTING_DATA,
    payload: { column, direction }
});

export const pageAndSize = (page, size) => ({
    type: PAGE_AND_SIZE_LISTING_DATA,
    payload: { page, size }
});
