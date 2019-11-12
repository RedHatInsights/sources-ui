export const sortByCompare = (key, direction, { sourceTypes } = {}) => (a, b) => {
    if (typeof a[key] === 'string' && typeof b[key] === 'string') {
        let valueA = a[key].toLowerCase();
        let valueB = b[key].toLowerCase();

        if (sourceTypes && key === 'source_type_id') {
            valueA = sourceTypes.find(type => type.id === a[key]);
            valueA = valueA ? valueA.product_name : '';

            valueB = sourceTypes.find(type => type.id === b[key]);
            valueB = valueB ? valueB.product_name : '';
        }

        return direction === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    }

    if (Array.isArray(a[key]) && Array.isArray(b[key])) {
        const valueA = a[key].length;
        const valueB = b[key].length;
        return (valueA > valueB) ? (direction === 'asc' ? 1 : -1) : ((valueB > valueA) ? (direction === 'asc' ? -1 : 1) : 0);
    }

    return 0;
};

export const filterByValue = (entity, column, value) =>
    column && value && value !== '' ? String(entity[column]).toLowerCase().includes(value.toLowerCase()) : true;

export const paginate = (entities, pageNumber, pageSize) => entities.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);

export const prepareEntities = (entities, {
    sortBy,
    sortDirection,
    filterColumn,
    filterValue,
    pageNumber,
    pageSize,
    sourceTypes
}) => (
    paginate(
        entities.filter(entity => filterByValue(entity, filterColumn, filterValue))
        .sort(sortByCompare(sortBy, sortDirection, { sourceTypes })),
        pageNumber,
        pageSize
    )
);
