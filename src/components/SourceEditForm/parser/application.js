import get from 'lodash/get';
import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { hardcodedSchemas } from '@redhat-cloud-services/frontend-components-sources';
import { modifyFields } from './helpers';

export const APP_NAMES = {
    COST_MANAGAMENT: '/insights/platform/cost-management'
};

export const getBillingSourceFields = (authentication) =>
    Object.keys(authentication)
    .map((key) => authentication[key].fields.filter(({ name }) => name.startsWith('billing_source')))
    .flatMap((x) => x);

export const getEnhancedBillingSourceField = (sourceType, name, authenticationsTypes) => {
    let field = undefined;

    authenticationsTypes.forEach((type) => {
        const apps = field ? {} : get(hardcodedSchemas, [sourceType, 'authentication', type], {});

        Object.keys(apps).find((key) => {
            const hasAppField = get(hardcodedSchemas, [sourceType, 'authentication', type, key, name], undefined);
            if (hasAppField) {
                field = hasAppField;
                return true;
            }
        });
    });

    return field ? field : {};
};

export const costManagementFields = (applications = [], sourceType, editing, setEdit, appTypes, authenticationsTypes) => {
    const costManagementApp = appTypes.find(({ name }) => name === APP_NAMES.COST_MANAGAMENT);

    if (!costManagementApp) {
        return undefined;
    }

    const hasCostManagement = applications.find(({ application_type_id }) => application_type_id === costManagementApp.id);

    if (!hasCostManagement) {
        return undefined;
    }

    const billingSourceFields = getBillingSourceFields(sourceType.schema.authentication);

    const enhandcedFields = billingSourceFields.map((field) => ({
        ...field,
        ...getEnhancedBillingSourceField(sourceType.name, field.name, authenticationsTypes)
    }));

    return ({
        component: componentTypes.SUB_FORM,
        title: costManagementApp.display_name,
        name: costManagementApp.display_name,
        fields: modifyFields(enhandcedFields, editing, setEdit)
    });
};

export const applicationsFields = (applications, sourceType, editing, setEdit, appTypes, authentications = []) => ([
    costManagementFields(
        applications,
        sourceType,
        editing,
        setEdit,
        appTypes,
        authentications.map(({ authtype }) => authtype)
    )
]);
