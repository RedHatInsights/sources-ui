import { restFilterGenerator } from '../api/entities';
import { sourcesColumns } from '../views/sourcesViewDefinition';

export const updateQuery = ({ sortBy, sortDirection, pageNumber, pageSize, filterValue }) => {
    const sortQuery = `sort_by[]=${sortBy}:${sortDirection}`;

    const paginationQuery = `limit=${pageSize}&offset=${(pageNumber - 1) * pageSize}`;

    const filterQuery = restFilterGenerator(filterValue);

    const query = `?${sortQuery}&${paginationQuery}${filterQuery ? `&${filterQuery}` : ''}`;

    const fullHref = decodeURIComponent(`${window.location.pathname}${query}`);

    if (location.href !== fullHref) {
        return history.replaceState('', '', fullHref);
    }

    return null;
};

export const parseQuery = () => {
    let fetchOptions = {};

    const urlParams = new URLSearchParams(window.location.search);

    const sortByRaw = urlParams.get('sort_by[]');

    let sortBy;
    let sortDirection;

    if (sortByRaw) {
        sortBy = sortByRaw.split(':')[0];
        sortDirection = sortByRaw.split(':')[1];

        sortBy = sourcesColumns({ formatMessage: () => '' })
        .filter(({ sortable }) => sortable)
        .map(({ value }) => value)
        .includes(sortBy) ? sortBy : 'created_at';
        sortDirection = ['desc', 'asc'].includes(sortDirection) ? sortDirection : 'desc';
    }

    if (sortBy && sortDirection) {
        fetchOptions = {
            sortBy,
            sortDirection
        };
    }

    const pageSize = urlParams.get('limit');
    const offset = urlParams.get('offset');

    let pageNumber;

    if (offset && pageSize) {
        pageNumber = ((offset / pageSize) + 1);
        if (isNaN(pageNumber)) {
            pageNumber = undefined;
        }
    }

    if (pageSize && pageNumber) {
        fetchOptions = {
            ...fetchOptions,
            pageNumber: parseInt(pageNumber, 10),
            pageSize: Math.min(parseInt(pageSize, 10), 100)
        };
    }

    let filterValue = {};

    const name = urlParams.get('filter[name][contains_i]');

    if (name) {
        filterValue = { name };
    }

    const sourceTypes = urlParams.getAll('filter[source_type_id][]');

    if (sourceTypes.length > 0) {
        filterValue = {
            ...filterValue,
            source_type_id: sourceTypes
        };
    }

    const hasSomeFilterValue = Object.entries(filterValue).map(([_key, value]) => value).filter(Boolean).length > 0;

    if (hasSomeFilterValue) {
        fetchOptions = {
            ...fetchOptions,
            filterValue
        };
    }

    return fetchOptions;
};
