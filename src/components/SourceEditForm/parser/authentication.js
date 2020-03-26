import React from 'react';
import get from 'lodash/get';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { hardcodedSchemas } from '@redhat-cloud-services/frontend-components-sources';
import { FormattedMessage } from 'react-intl';

import { EDIT_FIELD_NAME } from '../../EditField/EditField';
import { unsupportedAuthTypeField } from './unsupportedAuthType';

export const createAuthFieldName = (fieldName, id) => `authentications.a${id}.${fieldName.replace('authentication.', '')}`;

export const getLastPartOfName = (fieldName) => fieldName.split('.').pop();

export const removeRequiredValidator = (validate = []) =>
    validate.filter(validation => validation.type !== validatorTypes.REQUIRED);

export const getEnhancedAuthField = (sourceType, authtype, name) =>
    get(hardcodedSchemas, [sourceType, 'authentication', authtype, 'generic', name], {});

export const getAdditionalAuthSteps = (sourceType, authtype) =>
    get(hardcodedSchemas, [sourceType, 'authentication', authtype, 'generic', 'includeStepKeyFields'], []);

export const modifyAuthSchemas = (fields, id, editing, setEdit) => fields.map((field) => {
    const editedName = field.name.startsWith('authentication') ? createAuthFieldName(field.name, id) : field.name;
    const isEditing = editing[editedName];

    const finalField = ({
        ...field,
        name: editedName,
        component: isEditing ? field.component : EDIT_FIELD_NAME
    });

    if (!isEditing) {
        finalField.setEdit = setEdit;
    }

    const isPassword = getLastPartOfName(finalField.name) === 'password';

    if (isPassword) {
        finalField.helperText = (<FormattedMessage
            id="sources.passwordResetHelperText"
            defaultMessage={`Changing this resets your current { label }.`}
            values={{
                label: finalField.label
            }}
        />);
        finalField.isRequired = false;
        finalField.validate = removeRequiredValidator(finalField.validate);
    }

    return finalField;
});

export const authenticationFields = (authentications, sourceType, editing, setEdit) => {
    if (!authentications || authentications.length === 0 || !sourceType.schema || !sourceType.schema.authentication) {
        return [];
    }

    return authentications.map((auth) => {
        const schemaAuth = sourceType.schema.authentication.find(({ type }) => type === auth.authtype);

        if (!schemaAuth) {
            return unsupportedAuthTypeField(auth.authtype);
        }

        const additionalStepKeys = getAdditionalAuthSteps(sourceType.name, auth.authtype);

        const enhancedFields = schemaAuth.fields
        .filter(field => !field.stepKey || additionalStepKeys.includes(field.stepKey))
        .map((field) => ({
            ...field,
            ...getEnhancedAuthField(sourceType.name, auth.authtype, field.name)
        }));

        return ({
            component: componentTypes.SUB_FORM,
            title: schemaAuth.name,
            name: schemaAuth.name,
            fields: [
                modifyAuthSchemas(enhancedFields, auth.id, editing, setEdit)
            ]
        });
    });
};
