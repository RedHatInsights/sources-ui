import React from 'react';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import { hardcodedSchemas } from '@redhat-cloud-services/frontend-components-sources';
import { modifyFields } from './helpers';

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

    return ({
        component: componentTypes.SUB_FORM,
        title: <FormattedMessage
            id="sources.endpoint"
            defaultMessage="Endpoint"
        />,
        name: 'endpoint',
        fields: modifyFields(enhancedFields)
    });
};
