import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { getBillingSourceFields, getEnhancedBillingSourceField, costManagementFields, applicationsFields } from '../../../../components/SourceEditForm/parser/application';
import { applicationTypesData, COSTMANAGEMENT_APP } from '../../../applicationTypesData';
import { modifyFields } from '../../../../components/SourceEditForm/parser/helpers';

jest.mock('@redhat-cloud-services/frontend-components-sources', () => ({
    hardcodedSchemas: {
        aws: {
            authentication: {
                arn: {
                    generic: {
                        password: { name: 'superpassword' }
                    },
                    cm: {
                        username: { name: 'ultrapassword' }
                    }
                },
                secret: {
                    generic: {
                        password: { name: 'secretpassword' },
                        remember: { name: 'remember' }
                    }
                }
            }
        }
    }
}));

describe('application edit form parser', () => {
    describe('costManagementFields', () => {
        const APP_TYPES = applicationTypesData.data;
        const BILLING_SOURCE_FIELDS = [{ name: 'billing_source.field1' }];
        const FIELDS = [...BILLING_SOURCE_FIELDS, { name: 'field2' }];

        let APPLICATIONS;
        let EDITING;
        let SET_EDIT;
        let SOURCE_TYPE;
        let AUTHENTICATION_TYPES;

        beforeEach(() => {
            APPLICATIONS = [{ application_type_id: COSTMANAGEMENT_APP.id }];
            EDITING = {};
            SET_EDIT = jest.fn();
            SOURCE_TYPE = {
                name: 'aws',
                schema: {
                    authentication: {
                        arn: {
                            fields: FIELDS
                        }
                    }
                }
            };
            AUTHENTICATION_TYPES = ['arn'];
        });

        afterEach(() => {
            SET_EDIT.mockReset();
        });

        it('return undefined if cm app does not exist', () => {
            const EXPECTED_RESULT = undefined;

            const APPLICATION_TYPES_WITHOUT_CM = [];

            const result = costManagementFields(
                APPLICATIONS,
                EDITING,
                SET_EDIT,
                SOURCE_TYPE,
                APPLICATION_TYPES_WITHOUT_CM,
                AUTHENTICATION_TYPES,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        it('return undefined if applications is undefined', () => {
            const EXPECTED_RESULT = undefined;

            const UNDEF_APPLICATIONS = undefined;

            const result = costManagementFields(
                UNDEF_APPLICATIONS,
                EDITING,
                SET_EDIT,
                SOURCE_TYPE,
                APP_TYPES,
                AUTHENTICATION_TYPES,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        it('return undefined if have not cm attached', () => {
            const EXPECTED_RESULT = undefined;

            const APPLICATION_WITHOUT_CM = [];

            const result = costManagementFields(
                APPLICATION_WITHOUT_CM,
                EDITING,
                SET_EDIT,
                SOURCE_TYPE,
                APP_TYPES,
                AUTHENTICATION_TYPES,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        it('return cost management form group', () => {
            const EXPECTED_RESULT = {
                component: componentTypes.SUB_FORM,
                title: COSTMANAGEMENT_APP.display_name,
                name: COSTMANAGEMENT_APP.display_name,
                fields: modifyFields(BILLING_SOURCE_FIELDS, EDITING, SET_EDIT)
            };

            const result = costManagementFields(
                APPLICATIONS,
                SOURCE_TYPE,
                EDITING,
                SET_EDIT,
                APP_TYPES,
                AUTHENTICATION_TYPES,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        describe('applicationsFields', () => {
            it('returns CM fields', () => {
                const AUTHENTICATIONS = [{ authtype: 'arn' }];

                const CM_GROUP = {
                    component: componentTypes.SUB_FORM,
                    title: COSTMANAGEMENT_APP.display_name,
                    name: COSTMANAGEMENT_APP.display_name,
                    fields: modifyFields(BILLING_SOURCE_FIELDS, EDITING, SET_EDIT)
                };

                const EXPECTED_RESULT = [
                    CM_GROUP
                ];

                const result = applicationsFields(
                    APPLICATIONS,
                    SOURCE_TYPE,
                    EDITING,
                    SET_EDIT,
                    APP_TYPES,
                    AUTHENTICATIONS,
                );

                expect(result).toEqual(EXPECTED_RESULT);
            });
        });
    });

    describe('helpers', () => {
        describe('getBillingSourceFields', () => {
            it('return only billing source fields', () => {
                const BILLING_SOURCE_FIELD_1 = { name: 'billing_source.bucket' };
                const BILLING_SOURCE_FIELD_2 = { name: 'billing_source.rodeo' };

                const AUTHENTICATION = {
                    arn: {
                        fields: [
                            { name: 'authentication.password' },
                            BILLING_SOURCE_FIELD_1
                        ]
                    },
                    secret: {
                        fields: [
                            BILLING_SOURCE_FIELD_2,
                            { name: 'auth.secret' }
                        ]
                    }
                };

                const BILLING_SOURCE_FIELDS = [
                    BILLING_SOURCE_FIELD_1,
                    BILLING_SOURCE_FIELD_2
                ];

                expect(getBillingSourceFields(AUTHENTICATION)).toEqual(BILLING_SOURCE_FIELDS);
            });
        });

        describe('getEnhancedBillingSourceField', () => {
            it('returns field', () => {
                const FIELD = { name: 'superpassword' };

                expect(getEnhancedBillingSourceField('aws', 'password', ['arn'])).toEqual(FIELD);
            });

            it('returns field from multiple applications', () => {
                const FIELD = { name: 'ultrapassword' };

                expect(getEnhancedBillingSourceField('aws', 'username', ['arn'])).toEqual(FIELD);
            });

            it('returns field from multiple auth_types (find first)', () => {
                const FIELD = { name: 'superpassword' };

                expect(getEnhancedBillingSourceField('aws', 'password', ['arn', 'secret'])).toEqual(FIELD);
            });

            it('returns field from multiple auth_types (not first)', () => {
                const FIELD = { name: 'remember' };

                expect(getEnhancedBillingSourceField('aws', 'remember', ['arn', 'secret'])).toEqual(FIELD);
            });

            it('returns empty object when no field', () => {
                const EMPTY_OBJECT = {};

                expect(getEnhancedBillingSourceField('aws', 'password', [])).toEqual(EMPTY_OBJECT);
            });
        });
    });
});
