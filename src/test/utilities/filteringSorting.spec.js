import { sortByCompare, filterByValue, paginate, prepareEntities } from '../../Utilities/filteringSorting';

describe('filteringSorting utilities', () => {
    let testingArray;

    beforeEach(() => {
        testingArray = [
            { name: 'Bob', id: 8 },
            { name: 'Cecil', id: 1 },
            { name: 'Alois', id: 41 }
        ];
    });

    describe('sortByCompare', () => {
        it('returns DESC compared fields', () => {
            expect(testingArray.sort(sortByCompare('name', 'desc'))).toEqual([
                { name: 'Cecil', id: 1 },
                { name: 'Bob', id: 8 },
                { name: 'Alois', id: 41 }
            ]);
        });

        it('returns ASC compared fields', () => {
            expect(testingArray.sort(sortByCompare('name', 'asc'))).toEqual([
                { name: 'Alois', id: 41 },
                { name: 'Bob', id: 8 },
                { name: 'Cecil', id: 1 }
            ]);
        });
    });

    describe('filterByValue', () => {
        it('returns one element', () => {
            expect(testingArray.filter(entity => filterByValue(entity, 'name', 'OB'))).toEqual([{ name: 'Bob', id: 8 }]);
        });

        it('returns none', () => {
            expect(testingArray.filter(entity => filterByValue(entity, 'name', 'ROB'))).toEqual([]);
        });

        it('returns All', () => {
            expect(testingArray.filter(entity => filterByValue(entity, 'name', ''))).toEqual(testingArray);
        });
    });

    describe('paginate', () => {
        it('returns first element', () => {
            expect(paginate(testingArray, 1, 1)).toEqual([{ name: 'Bob', id: 8 }]);
        });

        it('returns last element', () => {
            expect(paginate(testingArray, 3, 1)).toEqual([{ name: 'Alois', id: 41 }]);
        });

        it('returns all elements', () => {
            expect(paginate(testingArray, 1, 10)).toEqual(testingArray);
        });
    });

    describe('prepareEntities', () => {
        it('returns all elements sorted DESC', () => {
            expect(prepareEntities(
                testingArray,
                { sortBy: 'name', sortDirection: 'desc', filterColumn: 'name', filterValue: '', pageNumber: 1, pageSize: 10 }
            ))
            .toEqual([
                { name: 'Cecil', id: 1 },
                { name: 'Bob', id: 8 },
                { name: 'Alois', id: 41 }
            ]);
        });

        it('returns all elements sorted DESC filtered by O', () => {
            expect(prepareEntities(
                testingArray,
                { sortBy: 'name', sortDirection: 'desc', filterColumn: 'name', filterValue: 'O', pageNumber: 1, pageSize: 10 }
            ))
            .toEqual([
                { name: 'Bob', id: 8 },
                { name: 'Alois', id: 41 }
            ]);
        });
    });
});
