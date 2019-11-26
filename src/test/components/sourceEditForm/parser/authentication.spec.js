import { validatorTypes, componentTypes } from '@data-driven-forms/react-form-renderer';

import { EDIT_FIELD_NAME } from '../../../../components/editField/EditField';
import {
    createAuthFieldName,
    getLastPartOfName,
    getEnhancedAuthField,
    getAdditionalAuthSteps,
    authenticationFields,
    modifyAuthSchemas,
    removeRequiredValidator
} from '../../../../components/SourceEditForm/parser/authentication';
import { unsupportedAuthTypeField } from '../../../../components/SourceEditForm/parser/unsupportedAuthType';

jest.mock('@redhat-cloud-services/frontend-components-sources', () => ({
    hardcodedSchemas: {
        aws: {
            authentication: {
                arn: {
                    generic: {
                        password: { name: 'superpassword' },
                        includeStepKeyFields: ['arn-step']
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

        describe('getAdditionalAuthSteps', () => {
            it('gets additional steps', () => {
                const ADDITIONAl_STEPS = ['arn-step'];

                expect(getAdditionalAuthSteps('aws', 'arn')).toEqual(ADDITIONAl_STEPS);
            });

            it('gets empty array', () => {
                const EMPTY_ADDITIONAl_STEPS = [];

                expect(getAdditionalAuthSteps('aws', 'nonsense')).toEqual(EMPTY_ADDITIONAl_STEPS);
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
        let EDITING;
        let SET_EDIT;
        let FIELD_NAME;

        beforeEach(() => {
            FIELD_NAME = 'sasas';
            FIELDS = [
                { name: FIELD_NAME, component: componentTypes.TEXT_FIELD }
            ];
            EDITING = {};
            SET_EDIT = jest.fn();
            ID = '1231325314';
        });

        afterEach(() => {
            SET_EDIT.mockReset();
        });

        it('parses correctly (change components to edit field)', () => {
            const result = modifyAuthSchemas(
                FIELDS,
                ID,
                EDITING,
                SET_EDIT
            );

            expect(result).toEqual([{
                ...FIELDS[0],
                component: EDIT_FIELD_NAME,
                name: createAuthFieldName(FIELD_NAME, ID),
                setEdit: SET_EDIT
            }]);
        });

        it('parses editing correctly', () => {
            EDITING = {
                [createAuthFieldName(FIELD_NAME, ID)]: true
            };

            const result = modifyAuthSchemas(
                FIELDS,
                ID,
                EDITING,
                SET_EDIT
            );

            expect(result).toEqual([{
                ...FIELDS[0],
                name: createAuthFieldName(FIELD_NAME, ID)
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
                EDITING,
                SET_EDIT
            );

            expect(result).toEqual([{
                ...FIELDS[0],
                component: EDIT_FIELD_NAME,
                name: createAuthFieldName(PASSWORD_NAME, ID),
                setEdit: SET_EDIT,
                isRequired: false,
                validate: [],
                helperText: expect.any(Object)
            }]);
        });
    });

    describe('authenticationFields', () => {
        let AUTHENTICATIONS;
        let SOURCE_TYPE;
        let EDITING;
        let SET_EDIT;
        let AUTHTYPE;
        let ID;

        beforeEach(() => {
            ID = '15165132';
            AUTHTYPE = 'arn';
            AUTHENTICATIONS = [{ authtype: AUTHTYPE, id: ID }];
            SOURCE_TYPE = {
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
            EDITING = {};
            SET_EDIT = jest.fn();
        });

        afterEach(() => {
            SET_EDIT.mockReset();
        });

        it('returns empty array when no authentications', () => {
            const EMPTY_AUTHENTICATIONS = [];

            const result = authenticationFields(
                EMPTY_AUTHENTICATIONS,
                SOURCE_TYPE,
                EDITING,
                SET_EDIT
            );

            expect(result).toEqual([]);
        });

        it('returns authentication form groups', () => {
            const result = authenticationFields(
                AUTHENTICATIONS,
                SOURCE_TYPE,
                EDITING,
                SET_EDIT
            );

            const authentication = SOURCE_TYPE.schema.authentication[0];
            const FIELDS_WITHOUT_STEPKEYS = [authentication.fields[0], authentication.fields[1]];

            const ARN_GROUP = {
                component: componentTypes.SUB_FORM,
                title: authentication.name,
                name: authentication.name,
                fields: [
                    modifyAuthSchemas(FIELDS_WITHOUT_STEPKEYS, ID, EDITING, SET_EDIT)
                ]
            };

            expect(result).toEqual([
                ARN_GROUP
            ]);
        });

        it('returns unsupported authentication type when unsupported', () => {
            const UNSUPPORTED_AUTHTYPE = 'openshift_default';
            const UNSUPPORTED_AUTHENTICATIONS = [{ authtype: UNSUPPORTED_AUTHTYPE, id: ID }];

            const result = authenticationFields(
                UNSUPPORTED_AUTHENTICATIONS,
                SOURCE_TYPE,
                EDITING,
                SET_EDIT
            );

            expect(result).toEqual([
                { ...unsupportedAuthTypeField(UNSUPPORTED_AUTHTYPE), Content: expect.any(Function) }
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
                EDITING,
                SET_EDIT
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
                EDITING,
                SET_EDIT
            );

            expect(result).toEqual(EMPTY_ARRAY);
        });
    });
});
