import get from 'lodash/get';
import drop from 'lodash/drop';
import take from 'lodash/take';
import orderBy from 'lodash/orderBy';
import lowerCase from 'lodash/lowerCase';
import filter from 'lodash/filter';
import flow from 'lodash/fp/flow';

export const sortList = (list, column, direction) =>
    !column ?
        list :
        orderBy(
            list,
            [element => lowerCase('' + get(element, column))],
            [direction === 'up' ? 'desc' : 'asc']
        );

export const paginateList = (list, pageNumber, pageSize) =>
    take(
        drop(list, pageSize * (pageNumber - 1)),
        pageSize
    );

export const filterList = (list, column, value) =>
    !value || !column ?
        list :
        filter(
            list,
            element => get(element, column).match(RegExp(value))
        );

export const processList = (list, options) => {
    const filtered = filterList(list, options.filterColumn, options.filterValue);

    return {
        length: filtered.length,
        list: flow(
            l => sortList(l, options.sortBy, options.sortDirection),
            l => paginateList(l, options.pageNumber, options.pageSize)
        )(filtered)
    };
};

