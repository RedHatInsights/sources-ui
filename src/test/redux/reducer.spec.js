import { entitiesLoaded, defaultProvidersState, undoAddSource, clearAddSource, filterProviders } from '../../redux/reducers/providers';

describe('redux > sources reducer', () => {
    describe('entitiesLoaded', () => {
        const SOURCES = [{ id: '1', name: 'name1' }, { id: '2', name: 'name2' }];
        const DATA = { payload: SOURCES };

        const EXPECTED_STATE = {
            ...defaultProvidersState,
            entities: SOURCES,
            loaded: true
        };

        it('loads the entities', () => {
            expect(entitiesLoaded(defaultProvidersState, DATA)).toEqual(
                expect.objectContaining(EXPECTED_STATE)
            );
        });

        it('pass additional props', () => {
            const ADDITIONAL_OPTIONS = {
                pageNumber: 1
            };

            const NEW_DATA = {
                ...DATA,
                ...ADDITIONAL_OPTIONS
            };

            expect(entitiesLoaded(defaultProvidersState, NEW_DATA)).toEqual(
                expect.objectContaining({
                    ...EXPECTED_STATE,
                    ...ADDITIONAL_OPTIONS
                })
            );
        });
    });

    describe('undoAddSource', () => {
        it('sets values', () => {
            const VALUES = { name: 'aa', source: { id: 1 } };

            expect(undoAddSource(defaultProvidersState, { payload: { values: VALUES } })).toEqual(
                expect.objectContaining({
                    ...defaultProvidersState,
                    addSourceInitialValues: VALUES
                })
            );
        });
    });

    describe('clearAddSource', () => {
        it('sets values to null', () => {
            const EMPTY_OBJECT = {};
            const NOT_EMPTY = { cosi: '133' };

            expect(clearAddSource({ ...defaultProvidersState, addSourceInitialValues: NOT_EMPTY })).toEqual(
                expect.objectContaining({
                    ...defaultProvidersState,
                    addSourceInitialValues: EMPTY_OBJECT
                })
            );
        });
    });

    describe('filterProviders', () => {
        const value = { name: 'name' };

        it('sets filter value', () => {
            expect(filterProviders(defaultProvidersState, { payload: { value } })).toEqual({
                ...defaultProvidersState,
                filterValue: {
                    name: 'name'
                }
            });
        });

        it('switch to the first page', () => {
            const stateOnSecondPage = {
                ...defaultProvidersState,
                pageNumber: 12
            };

            expect(filterProviders(stateOnSecondPage, { payload: { value } })).toEqual({
                ...defaultProvidersState,
                filterValue: {
                    name: 'name'
                },
                pageNumber: 1
            });
        });
    });
});
