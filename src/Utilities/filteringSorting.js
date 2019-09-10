export const sortByCompare = (key, direction) => (a, b) =>
    (a[key] > b[key]) ? (direction === 'asc' ? 1 : -1) : ((b[key] > a[key]) ? (direction === 'asc' ? -1 : 1) : 0);

export const filterByValue = (entity, column, value) =>
    column && value && value !== '' ? String(entity[column]).toLowerCase().includes(value.toLowerCase()) : true;

export const paginate = (entities, pageNumber, pageSize) => entities.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

export const prepareEntities = (entities, { sortBy, sortDirection, filterColumn, filterValue, pageNumber, pageSize }) => (
    paginate(
        entities.filter(entity => filterByValue(entity, filterColumn, filterValue)).sort(sortByCompare(sortBy, sortDirection)),
        pageNumber,
        pageSize
    )
);
