import selectAuthenticationStep, { SelectAuthenticationDescription } from '../../../../components/AddApplication/schema/selectAuthenticationStep';

import { TOPOLOGICALINVENTORY_APP, COSTMANAGEMENT_APP, applicationTypesData } from '../../../__mocks__/applicationTypesData';
import { AMAZON } from '../../../__mocks__/sourceTypesData';
import { AuthTypeSetter } from '../../../../components/AddApplication/AuthTypeSetter';
import { IntlProvider } from 'react-intl';

describe('selectAuthenticationStep', () => {
    const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

    it('selectAuthenticationStep generates selection step', () => {
        const source = {
            applications: [{
                application_type_id: TOPOLOGICALINVENTORY_APP.id,
                authentications: [{ id: '1' }]
            }]
        };
        const sourceType = AMAZON;
        const modifiedValues = {
            some: 'modifeidvalues'
        };
        const authenticationValues = [
            { id: '1', username: 'user-123', authtype: 'arn' },
            { id: '23324', authtype: 'arn' }
        ];
        const applicationTypes = applicationTypesData.data;

        const authSelection = selectAuthenticationStep({ intl, source, authenticationValues, sourceType, applicationTypes, modifiedValues });

        expect(authSelection).toEqual(expect.objectContaining({
            name: 'selectAuthentication',
            nextStep: expect.any(Function),
            fields: [
                expect.objectContaining({
                    name: 'authtypesetter',
                    component: 'description',
                    Content: AuthTypeSetter,
                    authenticationValues,
                    modifiedValues,
                    hideField: true
                }),
                expect.objectContaining({
                    name: `${COSTMANAGEMENT_APP.name}-subform`,
                    condition: {
                        and: [{
                            when: 'application.application_type_id',
                            is: COSTMANAGEMENT_APP.id
                        }]
                    },
                    fields: [
                        expect.objectContaining({ name: `${COSTMANAGEMENT_APP.name}-select-authentication-summary` }),
                        expect.objectContaining({
                            name: 'selectedAuthentication',
                            component: 'radio',
                            isRequired: true,
                            options: [
                                expect.objectContaining({ value: 'new-arn' }),
                                {
                                    label: `ARN-${authenticationValues[0].username}-${TOPOLOGICALINVENTORY_APP.display_name}`,
                                    value: authenticationValues[0].id
                                },
                                { label: `ARN-unused-${authenticationValues[1].id}`, value: authenticationValues[1].id }
                            ]
                        })
                    ]
                })
            ]
        }));

        expect(authSelection.nextStep({ values: {} })).toEqual('amazon--undefined');
        expect(authSelection.nextStep({ values: { application: { application_type_id: COSTMANAGEMENT_APP.id }, authtype: 'arn' } }))
        .toEqual('amazon-2-arn');
        expect(authSelection.nextStep({ values: { application: { application_type_id: COSTMANAGEMENT_APP.id }, authentication: { authtype: 'arn' } } }))
        .toEqual('amazon-2-arn');
    });

    it('selectAuthenticationStep generates selection step - when no auth available', () => {
        const source = {};
        const sourceType = AMAZON;
        const modifiedValues = {};
        const authenticationValues = [];
        const applicationTypes = applicationTypesData.data;

        const authSelection = selectAuthenticationStep({ intl, source, authenticationValues, sourceType, applicationTypes, modifiedValues });

        expect(authSelection).toEqual(expect.objectContaining({
            name: 'selectAuthentication',
            nextStep: expect.any(Function),
            fields: [
                expect.objectContaining({
                    name: 'authtypesetter',
                    component: 'description',
                    Content: AuthTypeSetter,
                    authenticationValues,
                    modifiedValues,
                    hideField: true
                }),
            ]
        }));
    });

    it('selectAuthenticationStep generates selection - multiple auth types', () => {
        const CUSTOM_APP = {
            id: '1',
            name: 'custom_app',
            supported_authentication_types: {
                amazon: ['arn', 'password']
            },
            supported_source_types: ['amazon'],
        };

        const source = { applications: [] };
        const sourceType = {
            id: '2',
            name: 'amazon',
            schema: {
                authentication: [
                    {
                        name: 'AWS Secret Key',
                        type: 'password',
                        fields: []
                    },
                    {
                        name: 'ARN',
                        type: 'arn',
                        fields: []
                    }
                ]
            },
        };
        const modifiedValues = {
            some: 'modifeidvalues'
        };
        const authenticationValues = [
            { id: '23324', authtype: 'arn' },
            { id: '23324', authtype: 'password' },
        ];
        const applicationTypes = [CUSTOM_APP];

        const authSelection = selectAuthenticationStep({ intl, source, authenticationValues, sourceType, applicationTypes, modifiedValues });

        expect(authSelection).toEqual(expect.objectContaining({
            name: 'selectAuthentication',
            nextStep: expect.any(Function),
            fields: [
                expect.objectContaining({
                    name: 'authtypesetter',
                    component: 'description',
                    Content: AuthTypeSetter,
                    authenticationValues,
                    modifiedValues,
                    hideField: true
                }),
                expect.objectContaining({
                    name: `${CUSTOM_APP.name}-subform`,
                    condition: {
                        and: [{
                            when: 'application.application_type_id',
                            is: CUSTOM_APP.id
                        }, {
                            when: 'authtype',
                            is: 'arn'
                        }]
                    },
                    fields: [
                        expect.objectContaining({ name: `${CUSTOM_APP.name}-select-authentication-summary` }),
                        expect.objectContaining({
                            name: 'selectedAuthentication',
                            component: 'radio',
                            isRequired: true,
                            options: [
                                expect.objectContaining({ value: 'new-arn' }),
                                { label: `ARN-unused-${authenticationValues[0].id}`, value: authenticationValues[0].id }
                            ]
                        })
                    ]
                }),
                expect.objectContaining({
                    name: `${CUSTOM_APP.name}-subform`,
                    condition: {
                        and: [{
                            when: 'application.application_type_id',
                            is: CUSTOM_APP.id
                        }, {
                            when: 'authtype',
                            is: 'password'
                        }]
                    },
                    fields: [
                        expect.objectContaining({ name: `${CUSTOM_APP.name}-select-authentication-summary` }),
                        expect.objectContaining({
                            name: 'selectedAuthentication',
                            component: 'radio',
                            isRequired: true,
                            options: [
                                expect.objectContaining({ value: 'new-password' }),
                                { label: `AWS Secret Key-unused-${authenticationValues[1].id}`, value: authenticationValues[1].id }
                            ]
                        })
                    ]
                })
            ]
        }));
    });

    describe('SelectAuthenticationDescription', () => {
        it('renders correctly', () => {
            const wrapper = mount(<IntlProvider locale="en">
                <SelectAuthenticationDescription
                    applicationTypeName="Catalog"
                    authenticationTypeName="ARN"
                />
            </IntlProvider>);

            expect(wrapper.text()).toEqual('Selected application Catalog supports ARN authentication type. You can use already defined authentication values or define new.');
        });
    });
});
