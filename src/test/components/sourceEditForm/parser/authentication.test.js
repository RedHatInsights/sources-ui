import { validatorTypes, componentTypes } from '@data-driven-forms/react-form-renderer';

import {
    createAuthFieldName,
    getLastPartOfName,
    getEnhancedAuthField,
    getAdditionalAuthStepsKeys,
    authenticationFields,
    modifyAuthSchemas,
    removeRequiredValidator,
    getAdditionalAuthSteps
} from '../../../../components/SourceEditForm/parser/authentication';
import GridLayout from '../../../../components/SourceEditForm/parser/GridLayout';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/hardcodedSchemas', () => ({
    __esModule: true,
    default: {
        aws: {
            authentication: {
                arn: {
                    generic: {
                        password: { name: 'superpassword' },
                        includeStepKeyFields: ['arn-step'],
                        additionalSteps: [{
                            fields: [{
                                name: 'additional-field'
                            }]
                        }]
                    }
                }
            }
        }
    }
}));

describe('authentication edit source parser', () => {
    describe('helpers', () => {
        describe('createAuthFieldName', () => {

            it('generates prefixed name', () => {
                const NAME = 'authentication.name';
                const ID = '123154';

                const PREFIXED_NAME = `authentications.a123154.name`;

                expect(createAuthFieldName(NAME, ID)).toEqual(PREFIXED_NAME);
            });
        });

        describe('getLastPartOfName', () => {
            it('gets last part of the name', () => {
                const NAME = 'authentication.name';
                const LAST_PART = 'name';

                expect(getLastPartOfName(NAME)).toEqual(LAST_PART);
            });
        });

        describe('getEnhancedAuthField', () => {
            it('gets enhanced field', () => {
                const FIELD = { name: 'superpassword' };

                expect(getEnhancedAuthField('aws', 'arn', 'password')).toEqual(FIELD);
            });

            it('gets empty', () => {
                const EMPTY_FIELD = {};

                expect(getEnhancedAuthField('aws', 'arn', 'nonsense')).toEqual(EMPTY_FIELD);
            });
        });

        describe('getAdditionalAuthStepsKeys', () => {
            it('gets additional steps', () => {
                const ADDITIONAl_STEPS = ['arn-step'];

                expect(getAdditionalAuthStepsKeys('aws', 'arn')).toEqual(ADDITIONAl_STEPS);
            });

            it('gets empty array', () => {
                const EMPTY_ADDITIONAl_STEPS = [];

                expect(getAdditionalAuthStepsKeys('aws', 'nonsense')).toEqual(EMPTY_ADDITIONAl_STEPS);
            });
        });

        describe('getAdditionalAuthSteps', () => {
            it('gets additional steps', () => {
                expect(getAdditionalAuthSteps('aws', 'arn')).toEqual([{
                    fields: [{
                        name: 'additional-field'
                    }]
                }]);
            });
        });

        describe('removeRequiredValidator', () => {
            it('removes required validator', () => {
                const REQUIRED_VALIDATOR = { type: validatorTypes.REQUIRED };
                const OTHER_VALIDATOR = { type: validatorTypes.LENGTH };

                const VALIDATE = [
                    REQUIRED_VALIDATOR,
                    OTHER_VALIDATOR
                ];

                expect(removeRequiredValidator(VALIDATE)).toEqual([OTHER_VALIDATOR]);
            });

            it('removes default value', () => {
                expect(removeRequiredValidator()).toEqual([]);
            });
        });
    });

    describe('modifyAuthSchemas', () => {
        let FIELDS;
        let ID;
        let FIELD_NAME;

        beforeEach(() => {
            FIELD_NAME = 'authentication.sasas';
            FIELDS = [
                { name: FIELD_NAME, component: componentTypes.TEXT_FIELD }
            ];
            ID = '1231325314';
        });

        it('parses correctly (change components to edit field)', () => {
            const result = modifyAuthSchemas(
                FIELDS,
                ID,
            );

            expect(result).toEqual([{
                ...FIELDS[0],
                name: createAuthFieldName(FIELD_NAME, ID),
            }]);
        });

        it('does not change name for non-authentication values', () => {
            const NOT_AUTH_NAME = 'source.source_ref';

            FIELDS = [
                { name: NOT_AUTH_NAME, component: componentTypes.TEXT_FIELD }
            ];

            const result = modifyAuthSchemas(
                FIELDS,
                ID,
            );

            expect(result).toEqual([{
                ...FIELDS[0],
                name: NOT_AUTH_NAME,
            }]);
        });

        it('parses password correctly', () => {
            const PASSWORD_NAME = 'authentication.password';

            const REQUIRED_VALIDATOR = { type: validatorTypes.REQUIRED };

            const FIELDS_WITH_PASSWORD = [
                {
                    name: PASSWORD_NAME,
                    validate: [REQUIRED_VALIDATOR],
                    isRequired: true
                }
            ];

            const result = modifyAuthSchemas(
                FIELDS_WITH_PASSWORD,
                ID,
            );

            expect(result).toEqual([{
                ...FIELDS_WITH_PASSWORD[0],
                component: 'authentication',
                name: createAuthFieldName(PASSWORD_NAME, ID),
            }]);
        });
    });

    describe('authenticationFields', () => {
        let AUTHENTICATIONS;
        let SOURCE_TYPE;
        let AUTHTYPE;
        let ID;

        beforeEach(() => {
            ID = '15165132';
            AUTHTYPE = 'arn';
            AUTHENTICATIONS = [{ authtype: AUTHTYPE, id: ID }];
            SOURCE_TYPE = {
                name: 'aws',
                id: '2',
                schema: {
                    authentication: [
                        {
                            type: 'arn',
                            name: 'ARN',
                            fields: [{
                                component: 'text-field',
                                name: 'authentication.authtype'
                            },  {
                                name: 'billing_source.bucket',
                                component: 'text-field'
                            }, {
                                name: 'authentication.no',
                                component: 'text-field',
                                stepKey: 'do not append'
                            }]
                        }
                    ]
                }
            };
        });

        it('returns empty array when no authentications', () => {
            const EMPTY_AUTHENTICATIONS = [];

            const result = authenticationFields(
                EMPTY_AUTHENTICATIONS,
                SOURCE_TYPE,
            );

            expect(result).toEqual([]);
        });

        it('returns empty array when no autheschemauath', () => {
            const result = authenticationFields(
                AUTHENTICATIONS,
                {
                    ...SOURCE_TYPE,
                    schema: {
                        authentication: []
                    }
                },
            );

            expect(result).toEqual([[]]);
        });

        it('returns authentication form groups', () => {
            const result = authenticationFields(
                AUTHENTICATIONS,
                SOURCE_TYPE,
            );

            const authentication = SOURCE_TYPE.schema.authentication[0];
            const FIELDS_WITHOUT_STEPKEYS = [authentication.fields[0], authentication.fields[1]];

            const ARN_GROUP = [
                {
                    name: `authentication-${AUTHENTICATIONS[0].id}`,
                    component: 'description',
                    id: AUTHENTICATIONS[0].id,
                    Content: GridLayout,
                    fields: modifyAuthSchemas(FIELDS_WITHOUT_STEPKEYS, ID)
                },
            ];

            expect(result).toEqual([
                ARN_GROUP
            ]);
        });

        it('returns empty array when source type does not have schema', () => {
            const EMPTY_ARRAY = [];

            const SOURCE_TYPE_WITHOUT_SCHEMA = {
                ...SOURCE_TYPE,
                schema: undefined
            };

            const result = authenticationFields(
                AUTHENTICATIONS,
                SOURCE_TYPE_WITHOUT_SCHEMA,
            );

            expect(result).toEqual(EMPTY_ARRAY);
        });

        it('returns empty array when source type does not have schema.authentication', () => {
            const EMPTY_ARRAY = [];

            const SOURCE_TYPE_WITHOUT_SCHEMA_AUTH = {
                ...SOURCE_TYPE,
                schema: {
                    authentication: undefined
                }
            };

            const result = authenticationFields(
                AUTHENTICATIONS,
                SOURCE_TYPE_WITHOUT_SCHEMA_AUTH,
            );

            expect(result).toEqual(EMPTY_ARRAY);
        });

        it('rename arn/cloud-meter-arn', () => {
            SOURCE_TYPE = {
                name: 'amazon',
                id: '1',
                schema: {
                    authentication: [{
                        type: 'arn',
                        fields: [{
                            component: 'text-field',
                            name: 'authentication.password',
                            label: 'arn'
                        }]
                    }, {
                        type: 'cloud-meter-arn',
                        fields: [{
                            component: 'text-field',
                            name: 'authentication.password',
                            label: 'arn'
                        }]
                    }, {
                        type: 'different',
                        fields: [{
                            component: 'text-field',
                            name: 'authentication.password',
                            label: 'arn'
                        }, {
                            component: 'text-field',
                            name: 'authentication.username',
                            label: 'username'
                        }]
                    }]
                }
            };

            AUTHENTICATIONS = [{
                authtype: 'arn',
                id: '123'
            }, {
                authtype: 'cloud-meter-arn',
                id: '234'
            }, {
                authtype: 'different',
                id: '345'
            }];

            const result = authenticationFields(
                AUTHENTICATIONS,
                SOURCE_TYPE,
            );

            expect(result[0][0].fields[0]).toEqual({ component: 'authentication', label: 'Cost Management ARN', name: 'authentications.a123.password' });
            expect(result[1][0].fields[0]).toEqual({ component: 'authentication', label: 'Subscription Watch ARN', name: 'authentications.a234.password' });
            expect(result[2][0].fields[0]).toEqual({ component: 'authentication', label: 'arn', name: 'authentications.a345.password' });
            expect(result[2][0].fields[1]).toEqual({ component: 'text-field', label: 'username', name: 'authentications.a345.username' });
        });
    });
});
