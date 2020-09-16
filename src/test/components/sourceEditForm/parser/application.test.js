import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import {
    getCMFields,
    getEnhancedCMField,
    costManagementFields,
    applicationsFields,
    appendClusterIdentifier,
    isCMField
} from '../../../../components/SourceEditForm/parser/application';
import { applicationTypesData, COSTMANAGEMENT_APP } from '../../../__mocks__/applicationTypesData';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/hardcodedSchemas', () => ({
    __esModule: true,
    default: {
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
        let SOURCE_TYPE;
        let SOURCE;

        beforeEach(() => {
            APPLICATIONS = [{ application_type_id: COSTMANAGEMENT_APP.id }];
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
            SOURCE = { authentications: [{ authtype: 'arn' }] };
        });

        it('return undefined if cm app does not exist', () => {
            const EXPECTED_RESULT = undefined;

            const APPLICATION_TYPES_WITHOUT_CM = [];

            const result = costManagementFields(
                APPLICATIONS,
                SOURCE_TYPE,
                APPLICATION_TYPES_WITHOUT_CM,
                SOURCE,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        it('return undefined if applications is undefined', () => {
            const EXPECTED_RESULT = undefined;

            const UNDEF_APPLICATIONS = undefined;

            const result = costManagementFields(
                UNDEF_APPLICATIONS,
                SOURCE_TYPE,
                APP_TYPES,
                SOURCE,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        it('return undefined if have not cm attached', () => {
            const EXPECTED_RESULT = undefined;

            const APPLICATION_WITHOUT_CM = [];

            const result = costManagementFields(
                APPLICATION_WITHOUT_CM,
                SOURCE_TYPE,
                APP_TYPES,
                SOURCE,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        it('return cost management form group', () => {
            const EXPECTED_RESULT = {
                component: componentTypes.SUB_FORM,
                title: COSTMANAGEMENT_APP.display_name,
                name: COSTMANAGEMENT_APP.display_name,
                fields: BILLING_SOURCE_FIELDS
            };

            const result = costManagementFields(
                APPLICATIONS,
                SOURCE_TYPE,
                APP_TYPES,
                SOURCE,
            );

            expect(result).toEqual(EXPECTED_RESULT);
        });

        describe('applicationsFields', () => {
            let CM_GROUP;
            let EXPECTED_RESULT;

            beforeEach(() => {
                CM_GROUP = {
                    component: componentTypes.SUB_FORM,
                    title: COSTMANAGEMENT_APP.display_name,
                    name: COSTMANAGEMENT_APP.display_name,
                    fields: BILLING_SOURCE_FIELDS
                };

                EXPECTED_RESULT = [
                    CM_GROUP
                ];
            });

            it('returns CM fields', () => {
                const result = applicationsFields(
                    APPLICATIONS,
                    SOURCE_TYPE,
                    APP_TYPES,
                    SOURCE,
                );

                expect(result).toEqual(EXPECTED_RESULT);
            });

            it('returns CM fields with no authentications', () => {
                const SOURCE_WITH_NO_AUTHS = {};

                const result = applicationsFields(
                    APPLICATIONS,
                    SOURCE_TYPE,
                    APP_TYPES,
                    SOURCE_WITH_NO_AUTHS,
                );

                expect(result).toEqual(EXPECTED_RESULT);
            });
        });
    });

    describe('helpers', () => {
        describe('isCMField', () => {
            it('billing_source.* is true', () => {
                expect(isCMField({ name: 'billing_source.name' })).toEqual(true);
            });

            it('credentials.* is true', () => {
                expect(isCMField({ name: 'credentials.name' })).toEqual(true);
            });

            it('nonsense.* is false', () => {
                expect(isCMField({ name: 'nonsense.name' })).toEqual(false);
            });
        });

        describe('getCMFields', () => {
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

                expect(getCMFields(AUTHENTICATION)).toEqual(BILLING_SOURCE_FIELDS);
            });
        });

        describe('getEnhancedCMField', () => {
            it('returns field', () => {
                const FIELD = { name: 'superpassword' };

                expect(getEnhancedCMField('aws', 'password', ['arn'])).toEqual(FIELD);
            });

            it('returns field from multiple applications', () => {
                const FIELD = { name: 'ultrapassword' };

                expect(getEnhancedCMField('aws', 'username', ['arn'])).toEqual(FIELD);
            });

            it('returns field from multiple auth_types (find first)', () => {
                const FIELD = { name: 'superpassword' };

                expect(getEnhancedCMField('aws', 'password', ['arn', 'secret'])).toEqual(FIELD);
            });

            it('returns field from multiple auth_types (not first)', () => {
                const FIELD = { name: 'remember' };

                expect(getEnhancedCMField('aws', 'remember', ['arn', 'secret'])).toEqual(FIELD);
            });

            it('returns empty object when no field', () => {
                const EMPTY_OBJECT = {};

                expect(getEnhancedCMField('aws', 'password', [])).toEqual(EMPTY_OBJECT);
            });
        });

        describe('appendClusterIdentifier', () => {
            const SOURCE_TYPE = { name: 'openshift' };

            it('returns cluster identifier field when type is openshift', () => {
                expect(appendClusterIdentifier(SOURCE_TYPE)).toEqual([{
                    name: 'source.source_ref',
                    label: expect.any(Object),
                    isRequired: true,
                    validate: [{ type: validatorTypes.REQUIRED }],
                    component: componentTypes.TEXT_FIELD,
                }]);
            });

            it('dont return cluster identifier field when type is not openshift', () => {
                const AWS_SOURCE_TYPE = { name: 'aws' };

                expect(appendClusterIdentifier(AWS_SOURCE_TYPE)).toEqual([]);
            });
        });
    });
});
