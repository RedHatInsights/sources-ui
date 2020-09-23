import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { FormattedMessage } from 'react-intl';
import {
    applicationsFields,
    appendClusterIdentifier,
} from '../../../../components/SourceEditForm/parser/application';
import { applicationTypesData, COSTMANAGEMENT_APP, CATALOG_APP } from '../../../__mocks__/applicationTypesData';
import { authenticationFields } from '../../../../components/SourceEditForm/parser/authentication';

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
    const APP_TYPES = applicationTypesData.data;
    const BILLING_SOURCE_FIELDS = [{ name: 'billing_source.field1' }];
    const FIELDS = [...BILLING_SOURCE_FIELDS, { name: 'field2' }];

    let APPLICATIONS;
    let SOURCE_TYPE;

    beforeEach(() => {
        APPLICATIONS = [{ application_type_id: COSTMANAGEMENT_APP.id, authentications: [{ id: '1234', authtype: 'arn' }] }];
        SOURCE_TYPE = {
            name: 'aws',
            product_name: 'Amazon',
            schema: {
                authentication: [{
                    name: 'ARN',
                    type: 'arn',
                    fields: FIELDS
                }, {
                    name: 'unused-type',
                    type: 'unused',
                    fields: []
                }]
            }
        };
    });

    it('return [] if applications is undefined', () => {
        const EXPECTED_RESULT = [];

        const UNDEF_APPLICATIONS = undefined;

        const result = applicationsFields(
            UNDEF_APPLICATIONS,
            SOURCE_TYPE,
            APP_TYPES,
        );

        expect(result).toEqual(EXPECTED_RESULT);
    });

    it('return cost management form group', () => {
        const EXPECTED_RESULT = [[{ name: 'billing_source.field1' }, { name: 'field2' }]];

        const result = applicationsFields(
            APPLICATIONS,
            SOURCE_TYPE,
            APP_TYPES,
        );

        expect(result).toEqual(EXPECTED_RESULT);
    });

    it('return multiple tabs', () => {
        APPLICATIONS = [
            ...APPLICATIONS,
            { application_type_id: CATALOG_APP.id, authentications: [{ id: '2345', authtype: 'arn' }] }
        ];

        const EXPECTED_RESULT = [{
            component: componentTypes.TABS,
            name: 'app-tabs',
            isBox: true,
            fields: [
                { name: COSTMANAGEMENT_APP.id, title: COSTMANAGEMENT_APP.display_name, fields: [[{ name: 'billing_source.field1' }, { name: 'field2' }]] },
                { name: CATALOG_APP.id, title: CATALOG_APP.display_name, fields: [[{ name: 'billing_source.field1' }, { name: 'field2' }]] }
            ]
        }];

        const result = applicationsFields(
            APPLICATIONS,
            SOURCE_TYPE,
            APP_TYPES,
        );

        expect(result).toEqual(EXPECTED_RESULT);
    });

    it('returns only unused auths', () => {
        const result = applicationsFields(
            [],
            SOURCE_TYPE,
            APP_TYPES,
            [{ authtype: 'arn', id: '12345' }]
        );

        expect(result).toEqual(
            [{
                component: 'sub-form',
                fields: [
                    {
                        component: 'plain-text',
                        label: <FormattedMessage
                            defaultMessage="The following {length, plural, one {authentication is not} other {authentications are not}} used by any application."
                            id="sources.authNotUsed"
                            values={{ length: 1 }}
                        />,
                        name: 'unused-auth-warning'
                    },
                    ...authenticationFields([{ authtype: 'arn', id: '12345' }], SOURCE_TYPE)
                ],
                name: 'unused-auths-group' }]
        );
    });

    it('return cost management form group and unused auths', () => {
        const result = applicationsFields(
            APPLICATIONS,
            SOURCE_TYPE,
            APP_TYPES,
            [{ authtype: 'arn', id: '12345' }]
        );

        expect(result).toEqual([{
            component: componentTypes.TABS,
            name: 'app-tabs',
            isBox: true,
            fields: [{
                title: 'Cost Management',
                fields: [FIELDS],
                name: '2'
            }, {
                name: 'unused-auths-tab',
                title: 'Amazon',
                fields: [
                    {
                        component: 'plain-text',
                        label: <FormattedMessage
                            defaultMessage="The following {length, plural, one {authentication is not} other {authentications are not}} used by any application."
                            id="sources.authNotUsed"
                            values={{ length: 1 }}
                        />,
                        name: 'unused-auth-warning'
                    },
                    ...authenticationFields([{ authtype: 'arn', id: '12345' }], SOURCE_TYPE)
                ],
            }]
        }]);
    });
});

describe('helpers', () => {
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
