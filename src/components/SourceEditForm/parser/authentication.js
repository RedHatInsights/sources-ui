import React from 'react';
import PropTypes from 'prop-types';

import { Grid } from '@patternfly/react-core/dist/js/layouts/Grid/Grid';
import { GridItem } from '@patternfly/react-core/dist/js/layouts/Grid/GridItem';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import TrashIcon from '@patternfly/react-icons/dist/js/icons/trash-icon';

import get from 'lodash/get';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import hardcodedSchemas from '@redhat-cloud-services/frontend-components-sources/cjs/hardcodedSchemas';

import AuthenticationId from './AuthenticationId';
import useFormApi from '@data-driven-forms/react-form-renderer/dist/cjs/use-form-api';

export const createAuthFieldName = (fieldName, id) => `authentications.a${id}.${fieldName.replace('authentication.', '')}`;

export const getLastPartOfName = (fieldName) => fieldName.split('.').pop();

export const removeRequiredValidator = (validate = []) =>
    validate.filter(validation => validation.type !== validatorTypes.REQUIRED && validation.type !== 'required-validator');

export const getEnhancedAuthField = (sourceType, authtype, name, appName = 'generic') =>
    get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, name], {});

export const getAdditionalAuthSteps = (sourceType, authtype, appName = 'generic') =>
    get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, 'additionalSteps'], []);

export const getAdditionalAuthStepsKeys = (sourceType, authtype, appName = 'generic') =>
    get(hardcodedSchemas, [sourceType, 'authentication', authtype, appName, 'includeStepKeyFields'], []);

export const getAdditionalFields = (auth, stepKey) => auth?.fields?.filter(field => field.stepKey === stepKey) || [];

export const modifyAuthSchemas = (fields, id) => fields.map((field) => {
    const editedName = field.name.startsWith('authentication') ? createAuthFieldName(field.name, id) : field.name;

    const finalField = ({
        ...field,
        name: editedName,
    });

    const isPassword = getLastPartOfName(finalField.name) === 'password';

    if (isPassword) {
        finalField.component = 'authentication';
    }

    return finalField;
});

const GridLayout = ({ id, fields }) => {
    const { renderForm } = useFormApi();

    return (<Grid>
        <GridItem md={2} style={{ display: 'flex' }}>
            <Button variant="plain" aria-label="Action" style={{ display: 'inline-flex' }}>
                <TrashIcon />
            </Button>
            <AuthenticationId id={id} />
        </GridItem>
        <GridItem md={10}>
            { renderForm(fields) }
        </GridItem>
    </Grid>);
};

export const authenticationFields = (authentications, sourceType, appName) => {
    if (!authentications || authentications.length === 0 || !sourceType.schema || !sourceType.schema.authentication) {
        return [];
    }

    return authentications.map((auth) => {
        const schemaAuth = sourceType?.schema?.authentication?.find(({ type }) => type === auth.authtype);

        if (!schemaAuth) {
            return [];
        }

        const additionalStepKeys = getAdditionalAuthStepsKeys(sourceType.name, auth.authtype, appName);
        const additionalStepsFields = getAdditionalAuthSteps(sourceType.name, auth.authtype, appName)
        ?.map(step => ({ ...step, fields: [...step.fields, ...getAdditionalFields(schemaAuth, step.name)] }))
        .map(({ fields }) => fields.map(({ name }) => name)).flatMap(x => x);

        const enhancedFields = schemaAuth.fields
        .filter(field => additionalStepsFields.includes(field.name)
        || !field.stepKey
        || (field.stepKey && additionalStepKeys.includes(field.stepKey))
        )
        .map((field) => ({
            ...field,
            ...getEnhancedAuthField(sourceType.name, auth.authtype, field.name, appName)
        }));

        if (!appName) {
            return ([
                {
                    name: `authentication-${auth.id}`,
                    component: 'description',
                    id: auth.id,
                    Content: GridLayout,
                    fields: modifyAuthSchemas(enhancedFields, auth.id)
                },
            ]);
        }

        return modifyAuthSchemas(enhancedFields, auth.id);
    });
};
