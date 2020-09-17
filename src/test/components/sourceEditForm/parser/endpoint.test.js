import { getEnhancedEndpointField, endpointFields } from '../../../../components/SourceEditForm/parser/endpoint';
import { componentTypes } from '@data-driven-forms/react-form-renderer';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/hardcodedSchemas', () => ({
    __esModule: true,
    default: {
        aws: {
            endpoint: {
                password: { name: 'superpassword' }
            }
        },
        ['ansible-tower']: {
            endpoint: {
                url: {
                    additional: 'value',
                    validate: [{ type: 'required' }, { type: 'url' }]
                }
            }
        }
    }
}));

describe('endpoint edit form parser', () => {
    describe('endpointFields', () => {
        let SOURCE_TYPE;
        let EDITING;
        let SET_EDIT;

        beforeEach(() => {
            EDITING = {};
            SET_EDIT = jest.fn();
        });

        it('returns nothing when hidden', () => {
            SOURCE_TYPE = {
                schema: { endpoint: { hidden: true } }
            };

            expect(endpointFields(SOURCE_TYPE, EDITING, SET_EDIT)).toEqual(undefined);
        });

        it('returns nothing when no schema', () => {
            SOURCE_TYPE = {
                schema: undefined
            };

            expect(endpointFields(SOURCE_TYPE, EDITING, SET_EDIT)).toEqual(undefined);
        });

        it('returns nothing when no schema.endpoint', () => {
            SOURCE_TYPE = {
                schema: {
                    endpoint: undefined
                }
            };

            expect(endpointFields(SOURCE_TYPE, EDITING, SET_EDIT)).toEqual(undefined);
        });

        it('returns endpoint SUBFORM', () => {
            const FIELDS = [
                { name: 'field1' },
                { name: 'field2' }
            ];

            SOURCE_TYPE = {
                schema: { endpoint: { fields: FIELDS } }
            };

            const result = endpointFields(SOURCE_TYPE, EDITING, SET_EDIT);

            expect(result).toEqual({
                component: componentTypes.SUB_FORM,
                title: expect.any(Object),
                name: 'endpoint',
                fields: FIELDS
            });
        });

        it('returns endpoint SUBFORM for tower source', () => {
            const FIELDS = [
                { name: 'url' },
                { name: 'field2' }
            ];

            SOURCE_TYPE = {
                name: 'ansible-tower',
                schema: { endpoint: { fields: FIELDS } }
            };

            const result = endpointFields(SOURCE_TYPE, EDITING, SET_EDIT);

            expect(result).toEqual({
                component: componentTypes.SUB_FORM,
                title: expect.any(Object),
                name: 'endpoint',
                fields: [{
                    component: componentTypes.SUB_FORM,
                    name: 'receptor_node_group',
                    condition: {
                        when: 'endpoint.receptor_node',
                        isNotEmpty: true
                    },
                    fields: [{
                        ...FIELDS[0],
                        isRequired: false,
                        additional: 'value',
                        validate: [{ type: 'url' }]
                    }]
                }, {
                    component: componentTypes.SUB_FORM,
                    name: 'hostname_group',
                    condition: {
                        when: 'endpoint.receptor_node',
                        isEmpty: true
                    },
                    fields: [
                        {
                            ...FIELDS[0],
                            additional: 'value',
                            validate: [{ type: 'required' }, { type: 'url' }]
                        },
                        FIELDS[1]
                    ]
                }]
            });
        });
    });

    describe('getEnhancedEndpointField', () => {
        it('returns enhanced field', () => {
            expect(getEnhancedEndpointField('aws', 'password')).toEqual({ name: 'superpassword' });
        });

        it('returns empty object by default', () => {
            expect(getEnhancedEndpointField('aws', 'nonsense')).toEqual({});
        });
    });
});
