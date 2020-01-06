import addApplicationSchema, { hasAlreadySupportedAuthType } from '../../../components/AddApplication/AddApplicationSchema';
import { sourceTypesData, OPENSHIFT_ID } from '../../sourceTypesData';
import { applicationTypesData, COSTMANAGEMENT_APP } from '../../applicationTypesData';

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

        expect(result.fields[0].fields).toHaveLength(9);
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
