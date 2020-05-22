import {
    afterSuccess,
    afterSuccessLoadParameters,
    chipsFormatters,
    prepareSourceTypeSelection,
    removeChips,
    prepareChips,
    loadedTypes,
    prepareApplicationTypeSelection
} from '../../../pages/Sources/helpers';

import * as actions from '../../../redux/sources/actions';
import { sourceTypesData } from '../../__mocks__/sourceTypesData';
import { applicationTypesData } from '../../__mocks__/applicationTypesData';
import * as sourcesApi from '../../../api/checkSourceStatus';

describe('Source page helpers', () => {
    describe('afterSuccess', () => {
        it('calls function and checks source availibility status', () => {
            const dispatch = jest.fn();
            const source = { id: '154586' };

            sourcesApi.checkSourceStatus = jest.fn();

            actions.loadEntities = jest.fn();

            afterSuccess(dispatch, source);

            expect(dispatch.mock.calls.length).toBe(1);
            expect(actions.loadEntities).toHaveBeenCalledWith(afterSuccessLoadParameters);

            expect(sourcesApi.checkSourceStatus).toHaveBeenCalledWith(source.id);
        });
    });

    describe('chipsFormatters', () => {
        const NAME = 'some name';
        const filterValue = {
            name: NAME,
            source_type_id: ['3', '5', '333'],
            applications: ['1', '667'],
        };

        it('returns chip for name', () => {
            const key = 'name';

            expect(chipsFormatters('name', filterValue, sourceTypesData.data)()).toEqual({
                key,
                name: NAME
            });
        });

        it('returns chips for source_types', () => {
            const key = 'source_type_id';

            expect(chipsFormatters(key, filterValue, sourceTypesData.data)()).toEqual({
                category: 'Source Type',
                key,
                chips: [{
                    name: sourceTypesData.data.find(({ id }) => id === '3').product_name,
                    value: '3'
                }, {
                    name: sourceTypesData.data.find(({ id }) => id === '5').product_name,
                    value: '5'
                }, {
                    name: '333',
                    value: '333'
                }]
            });
        });

        it('returns chips for applications', () => {
            const key = 'applications';

            expect(chipsFormatters(key, filterValue, sourceTypesData.data, applicationTypesData.data)()).toEqual({
                category: 'Application',
                key,
                chips: [{
                    name: applicationTypesData.data.find(({ id }) => id === '1').display_name,
                    value: '1'
                }, {
                    name: '667',
                    value: '667'
                }]
            });
        });

        it('returns chips for unknown', () => {
            const key = 'unknown';

            expect(chipsFormatters(key, filterValue, sourceTypesData.data)()).toEqual({
                name: key
            });
        });
    });

    describe('prepareSourceTypeSelection', () => {
        it('parses source types into selection', () => {
            const sourceTypes = [{ id: '23', product_name: 'First type' }, { id: '12', product_name: 'Last type' }];

            expect(prepareSourceTypeSelection(sourceTypes)).toEqual([
                { label: 'First type', value: '23' },
                { label: 'Last type', value: '12' }
            ]);
        });

        it('selection is sorted alphabetically', () => {
            const sourceTypes = [{ id: '12', product_name: 'Last type' }, { id: '23', product_name: 'First type' }];

            expect(prepareSourceTypeSelection(sourceTypes)).toEqual([
                { label: 'First type', value: '23' },
                { label: 'Last type', value: '12' }
            ]);
        });
    });

    describe('prepareApplicationTypeSelection', () => {
        it('parses application types into selection and selection is sorted alphabetically', () => {
            const appTypes = [{ id: '23', display_name: 'B' }, { id: '12', display_name: 'A' }];

            expect(prepareApplicationTypeSelection(appTypes)).toEqual([
                { label: 'A', value: '12' },
                { label: 'B', value: '23' }
            ]);
        });
    });

    describe('removeChips', () => {
        const filterValue = {
            name: 'some name',
            source_type_id: ['3', '5', '333']
        };

        it('deletes all chips', () => {
            const DELETE_ALL = true;

            expect(removeChips([], filterValue, DELETE_ALL)).toEqual({
                name: undefined,
                source_type_id: undefined
            });
        });

        it('deletes name chip chips', () => {
            expect(removeChips([{ key: 'name' }], filterValue)).toEqual({
                name: undefined,
                source_type_id: ['3', '5', '333']
            });
        });

        it('deletes one of source_types', () => {
            expect(removeChips([{ key: 'source_type_id', chips: [{ value: '5' }] }], filterValue)).toEqual({
                name: 'some name',
                source_type_id: ['3', '333']
            });
        });
    });

    describe('prepareChips', () => {
        const filterValue = {
            name: 'some name',
            source_type_id: ['3', '5', '333'],
            applications: ['1', '667'],
            empty: [],
            undefined
        };

        it('prepares chips', () => {
            expect(prepareChips(filterValue, sourceTypesData.data, applicationTypesData.data)).toEqual([
                chipsFormatters('name', filterValue, sourceTypesData.data)(),
                chipsFormatters('source_type_id', filterValue, sourceTypesData.data)(),
                chipsFormatters('applications', filterValue, sourceTypesData.data, applicationTypesData.data)()
            ]);
        });
    });

    describe('loadedTypes', () => {
        let types;
        let loaded;

        it('returns types when loaded and length > 0', () => {
            types = [1, 2];
            loaded = true;

            expect(loadedTypes(types, loaded)).toEqual(types);
        });

        it('returns undefined when not loaded', () => {
            types = [1, 2];
            loaded = false;

            expect(loadedTypes(types, loaded)).toEqual(undefined);
        });

        it('returns undefined when length < 0', () => {
            types = [];
            loaded = true;

            expect(loadedTypes(types, loaded)).toEqual(undefined);
        });
    });
});
