import { entitiesLoaded, defaultProvidersState } from '../../redux/reducers/providers';

describe('redux > sources reducer', () => {
    describe('entitiesLoaded', () => {
        const SOURCES = [{ id: '1', name: 'name1' }, { id: '2', name: 'name2' }];
        const DATA = { payload: SOURCES };

        const EXPECTED_STATE = {
            ...defaultProvidersState,
            entities: SOURCES,
            numberOfEntities: SOURCES.length,
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
});
