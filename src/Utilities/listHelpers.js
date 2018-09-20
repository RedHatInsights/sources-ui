import get from 'lodash/get';
import drop from 'lodash/drop';
import take from 'lodash/take';
import orderBy from 'lodash/orderBy';
import lowerCase from 'lodash/lowerCase';

export function sortList(list, column, direction) {
    if (! column) return list;

    return orderBy(
        list,
        [element => lowerCase(get(element, column))],
        [direction == 'up' ? 'desc' : 'asc']
    )
}

export function paginateList(list, pageNumber, pageSize) {
    return take(
      drop(list, pageSize * (pageNumber - 1)),
      pageSize
    )
}
