import { sortByCompare, filterByValue, paginate, prepareEntities } from '../../Utilities/filteringSorting';

describe('filteringSorting utilities', () => {
    let testingArray;
    let testingArrayWithApps;

    beforeEach(() => {
        testingArray = [
            { name: 'Bob', id: 8 },
            { name: 'Cecil', id: 1 },
            { name: 'Alois', id: 41 }
        ];

        testingArrayWithApps = [
            { apps: ['1', '2'] },
            { apps: [] },
            { apps: ['3'] }
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

        it('compares array by length ASC', () => {
            expect(testingArrayWithApps.sort(sortByCompare('apps', 'asc'))).toEqual([
                { apps: [] },
                { apps: ['3'] },
                { apps: ['1', '2'] }
            ]);
        });

        it('compares array by length DESC', () => {
            expect(testingArrayWithApps.sort(sortByCompare('apps', 'desc'))).toEqual([
                { apps: ['1', '2'] },
                { apps: ['3'] },
                { apps: [] }
            ]);
        });

        it('do not compare different types', () => {
            testingArray = [
                { apps: 'app' },
                { apps: ['1'] }
            ];

            expect(testingArray.sort(sortByCompare('apps', 'desc'))).toEqual(testingArray);
            expect(testingArray.sort(sortByCompare('apps', 'asc'))).toEqual(testingArray);
        });

        describe('source_type_id', () => {
            const FIRST_SOURCE_ID = '300';
            const NEXT_SOURCE_ID = '1';
            const LAST_SOURCE_ID = '15';

            const SOURCE_TYPES = [
                { id: NEXT_SOURCE_ID, product_name: 'B' },
                { id: LAST_SOURCE_ID, product_name: 'C' },
                { id: FIRST_SOURCE_ID, product_name: 'A' }
            ];

            const testingArrayTypes = [
                { source_type_id: NEXT_SOURCE_ID },
                { source_type_id: LAST_SOURCE_ID },
                { source_type_id: FIRST_SOURCE_ID }
            ];

            it('sort ASC', () => {
                expect(testingArrayTypes.sort(sortByCompare('source_type_id', 'asc', { sourceTypes: SOURCE_TYPES }))).toEqual([
                    { source_type_id: FIRST_SOURCE_ID },
                    { source_type_id: NEXT_SOURCE_ID },
                    { source_type_id: LAST_SOURCE_ID }
                ]);
            });

            it('sort DESC', () => {
                expect(testingArrayTypes.sort(sortByCompare('source_type_id', 'desc', { sourceTypes: SOURCE_TYPES }))).toEqual([
                    { source_type_id: LAST_SOURCE_ID },
                    { source_type_id: NEXT_SOURCE_ID },
                    { source_type_id: FIRST_SOURCE_ID }
                ]);
            });
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
