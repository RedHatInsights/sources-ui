import React from 'react';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import hardcodedSchemas from '@redhat-cloud-services/frontend-components-sources/cjs/hardcodedSchemas';
import { modifyFields } from './helpers';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

export const getEnhancedEndpointField = (sourceType, name) =>
    get(hardcodedSchemas, [sourceType, 'endpoint', name], {});

export const endpointFields = (sourceType) => {
    if (!sourceType.schema || !sourceType.schema.endpoint || sourceType.schema.endpoint.hidden) {
        return undefined;
    }

    const schemaAuth = sourceType.schema.endpoint;

    const enhancedFields = schemaAuth.fields.map((field) => ({
        ...field,
        ...getEnhancedEndpointField(sourceType.name, field.name)
    }));

    const modifiedFields = modifyFields(enhancedFields);

    const subForm = {
        component: componentTypes.SUB_FORM,
        title: <FormattedMessage
            id="sources.endpoint"
            defaultMessage="Endpoint"
        />,
        name: 'endpoint',
    };

    if (sourceType.name === 'ansible-tower') {
        const url = modifiedFields.find(({ name }) => name === 'url');

        return ({
            ...subForm,
            fields: [{
                component: componentTypes.SUB_FORM,
                name: 'receptor_node_group',
                condition: {
                    when: 'endpoint.receptor_node',
                    isNotEmpty: true
                },
                fields: [{
                    ...url,
                    isRequired: false,
                    validate: url?.validate?.filter(validation => validation.type !== validatorTypes.REQUIRED)
                }]
            }, {
                component: componentTypes.SUB_FORM,
                name: 'hostname_group',
                condition: {
                    when: 'endpoint.receptor_node',
                    isEmpty: true
                },
                fields: modifiedFields
            }]
        });
    }

    return ({
        ...subForm,
        fields: modifiedFields
    });
};
