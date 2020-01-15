import {
    onCloseAddSourceWizard,
    afterSuccess,
    afterSuccessLoadParameters,
    chipsFormatters,
    prepareSourceTypeSelection,
    removeChips,
    prepareChips,
    loadedTypes
} from '../../../pages/SourcesPage/helpers';

import * as actions from '../../../redux/actions/sources';
import { sourceTypesData } from '../../sourceTypesData';

describe('Source page helpers', () => {
    describe('onCloseAddSourceWizard', () => {
        let args;

        beforeEach(() => {
            args = {
                values: { some_value: 'aa' },
                intl: {
                    formatMessage: ({ defaultMessage }) => defaultMessage
                },
                dispatch: jest.fn(),
                history: {
                    push: jest.fn()
                }
            };

            actions.addMessage = jest.fn();
            actions.clearAddSource = jest.fn();
        });

        it('create notifications when values', () => {
            const tmpDate = Date.now;

            const TIMESTAMP = 12345313512;

            Date.now = () => TIMESTAMP;

            const EXPECTED_TITLE = expect.any(String);
            const EXPECTED_VARIANT = expect.any(String);
            const EXPECTED_DEESCRIPTION = expect.any(Object);
            const EXPECTED_CUSTOM_ID = TIMESTAMP;

            onCloseAddSourceWizard(args);

            expect(actions.addMessage).toHaveBeenCalledWith(
                EXPECTED_TITLE,
                EXPECTED_VARIANT,
                EXPECTED_DEESCRIPTION,
                EXPECTED_CUSTOM_ID
            );
            expect(actions.clearAddSource).toHaveBeenCalled();
            expect(args.history.push).toHaveBeenCalled();

            Date.now = tmpDate;
        });

        it('only clear and change path when no values/empty', () => {
            onCloseAddSourceWizard({ ...args, values: {} });

            expect(actions.addMessage).not.toHaveBeenCalled();
            expect(actions.clearAddSource).toHaveBeenCalled();
            expect(args.history.push).toHaveBeenCalled();
        });
    });

    describe('afterSuccess', () => {
        it('calls function', () => {
            const dispatch = jest.fn();

            actions.loadEntities = jest.fn();
            actions.clearAddSource = jest.fn();

            afterSuccess(dispatch);

            expect(dispatch.mock.calls.length).toBe(2);
            expect(actions.loadEntities).toHaveBeenCalledWith(afterSuccessLoadParameters);
            expect(actions.loadEntities).toHaveBeenCalled();
        });
    });

    describe('chipsFormatters', () => {
        const NAME = 'some name';
        const filterValue = {
            name: NAME,
            source_type_id: ['3', '5', '333']
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
            empty: [],
            undefined
        };

        it('prepares chips', () => {
            expect(prepareChips(filterValue, sourceTypesData.data)).toEqual([
                chipsFormatters('name', filterValue, sourceTypesData.data)(),
                chipsFormatters('source_type_id', filterValue, sourceTypesData.data)()
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
