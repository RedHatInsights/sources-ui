import addApplicationSchema, { hasAlreadySupportedAuthType, selectAuthenticationStep } from '../../../components/AddApplication/AddApplicationSchema';
import { sourceTypesData, OPENSHIFT_ID, AMAZON } from '../../__mocks__/sourceTypesData';
import { applicationTypesData, COSTMANAGEMENT_APP, TOPOLOGICALINVENTORY_APP } from '../../__mocks__/applicationTypesData';
import { AuthTypeSetter } from '../../../components/AddApplication/AuthTypeSetter';

describe('AddApplicationSchema', () => {
    const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };
    const sourceTypes = sourceTypesData.data;
    const applicationTypes = applicationTypesData.data;
    const authenticationValues = [];

    it('imported schema - creates only selection, review', () => {
        const applications = [];
        const source = {
            imported: true
        };

        const result = addApplicationSchema(
            applications,
            intl,
            sourceTypes,
            applicationTypes,
            authenticationValues,
            source
        );

        const selectionStep = expect.objectContaining({
            title: 'Select application'
        });

        const summaryStep = expect.objectContaining({
            title: 'Review'
        });

        expect(result).toEqual({
            fields: [
                expect.objectContaining({
                    fields: [
                        selectionStep,
                        summaryStep
                    ]
                })
            ]
        });
    });

    it('openshift schema', () => {
        const applications = [{
            COSTMANAGEMENT_APP
        }];
        const source = {
            source_type_id: OPENSHIFT_ID
        };

        const result = addApplicationSchema(
            applications,
            intl,
            sourceTypes,
            applicationTypes,
            authenticationValues,
            source
        );

        expect(result.fields[0].fields).toHaveLength(7);
    });

    it('no available apps', () => {
        const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };
        const source = {};

        const result = addApplicationSchema(
            undefined,
            intl,
            sourceTypes,
            applicationTypes,
            authenticationValues,
            source
        );

        const selectionStep = expect.objectContaining({
            title: 'Select application',
            nextStep: undefined
        });

        const summaryStep = expect.objectContaining({
            title: 'Review'
        });

        expect(result).toEqual({
            fields: [
                expect.objectContaining({
                    fields: [
                        selectionStep,
                        summaryStep
                    ]
                })
            ]
        });
    });

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

        const intl = { formatMessage: ({ defaultMessage }) => defaultMessage };

        const authSelection = selectAuthenticationStep({ intl, source, authenticationValues, sourceType, applicationTypes, modifiedValues });

        expect(authSelection).toEqual(expect.objectContaining({
            name: 'selectAuthentication',
            nextStep: expect.any(Function),
            fields: [
                expect.objectContaining({ name: 'authtypesetter', component: 'description', Content: AuthTypeSetter }),
                expect.objectContaining({
                    name: `${COSTMANAGEMENT_APP.name}-subform`,
                    fields: [
                        expect.objectContaining({ name: `${COSTMANAGEMENT_APP.name}-select-authentication-summary` }),
                        expect.objectContaining({
                            name: 'selectedAuthentication',
                            component: 'radio',
                            isRequired: true,
                            options: [
                                expect.objectContaining({ value: 'new' }),
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

        expect(authSelection.nextStep({ values: {} })).toEqual('amazon-');
        expect(authSelection.nextStep({ values: { application: { application_type_id: COSTMANAGEMENT_APP.id } } }))
        .toEqual('amazon-2');
    });

    describe('hasAlreadySupportedAuthType', () => {
        const sourceTypeName = 'openshift';
        const appType = {
            supported_authentication_types: {
                [sourceTypeName]: ['token']
            }
        };

        it('has already auth type', () => {
            const authValues = [{
                authtype: 'token'
            }];

            expect(hasAlreadySupportedAuthType(authValues, appType, sourceTypeName)).toEqual(authValues[0]);
        });

        it('doesnot have already auth type', () => {
            const authValues = [];

            expect(hasAlreadySupportedAuthType(authValues, appType, sourceTypeName)).toEqual(undefined);
        });

        it('undefined authValues', () => {
            const authValues = undefined;

            expect(hasAlreadySupportedAuthType(authValues, appType, sourceTypeName)).toEqual(undefined);
        });
    });
});
