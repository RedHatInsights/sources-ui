import React from 'react';
import get from 'lodash/get';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { hardcodedSchemas } from '@redhat-cloud-services/frontend-components-sources';
import { FormattedMessage } from 'react-intl';
import { modifyFields } from './helpers';
import { EDIT_FIELD_NAME } from '../../editField/EditField';

export const APP_NAMES = {
    COST_MANAGAMENT: '/insights/platform/cost-management'
};

export const cmFieldsPrefixes = ['billing_source', 'credentials'];

export const isCMField = ({ name }) => cmFieldsPrefixes.some((prefix) => name.startsWith(prefix));

export const getCMFields = (authentication) =>
    Object.keys(authentication)
    .map((key) => authentication[key].fields.filter(isCMField))
    .flatMap((x) => x);

export const getEnhancedCMField = (sourceType, name, authenticationsTypes) => {
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

export const appendClusterIdentifier = (editing, setEdit, sourceType) =>
    sourceType.name === 'openshift' ? [{
        name: 'source.source_ref',
        label: <FormattedMessage
            id="sources.clusterIdentifier"
            defaultMessage="Cluster identifier"
        />,
        isRequired: true,
        ...(editing['source.source_ref'] ? {} : { setEdit }),
        validate: [{ type: validatorTypes.REQUIRED }],
        component: editing['source.source_ref'] ? componentTypes.TEXT_FIELD : EDIT_FIELD_NAME
    }] : [];

export const costManagementFields = (
    applications = [],
    sourceType,
    editing,
    setEdit,
    appTypes,
    source
) => {
    const costManagementApp = appTypes.find(({ name }) => name === APP_NAMES.COST_MANAGAMENT);

    if (!costManagementApp) {
        return undefined;
    }

    const hasCostManagement = applications.find(({ application_type_id }) => application_type_id === costManagementApp.id);

    if (!hasCostManagement) {
        return undefined;
    }

    const billingSourceFields = getCMFields(sourceType.schema.authentication);

    const authenticationsTypes = source.authentications ? source.authentications.map(({ authtype }) => authtype) : [];

    const enhandcedFields = billingSourceFields.map((field) => ({
        ...field,
        ...getEnhancedCMField(sourceType.name, field.name, authenticationsTypes)
    }));

    return ({
        component: componentTypes.SUB_FORM,
        title: costManagementApp.display_name,
        name: costManagementApp.display_name,
        fields: [
            ...modifyFields(enhandcedFields, editing, setEdit),
            ...appendClusterIdentifier(editing, setEdit, sourceType)
        ]
    });
};

export const applicationsFields = (
    applications,
    sourceType,
    editing,
    setEdit,
    appTypes,
    source
) => ([
    costManagementFields(
        applications,
        sourceType,
        editing,
        setEdit,
        appTypes,
        source
    )
]);
