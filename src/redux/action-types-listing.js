const asyncActions = [
    'LOAD_LISTING_DATA'
].reduce((acc, curr) => [
    ... acc,
    ...[curr, `${curr}_PENDING`, `${curr}_FULFILLED`, `${curr}_REJECTED`]
], []);

export const ASYNC_ACTION_TYPES = [
    ...asyncActions
]
.reduce((acc, curr) => {
    acc[curr] = curr;
    return acc;
},
{}
);
export const SORT_LISTING_DATA = 'SORT_LISTING_DATA';
export const PAGE_AND_SIZE_LISTING_DATA = 'PAGE_AND_SIZE_LISTING_DATA';
