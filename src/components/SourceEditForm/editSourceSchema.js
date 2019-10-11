import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { TextContent, Title } from '@patternfly/react-core';
import { schemaBuilder, asyncValidator } from '@redhat-cloud-services/frontend-components-sources';
import { FormattedMessage } from 'react-intl';

import { endpointToUrl } from '../SourcesSimpleView/formatters';

export const compileAllSourcesComboOptions = (sourceTypes) => (
    [
        ...sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    ]
);

const firstStepEdit = (sourceTypes, type, sourceId) => ({
    title: <FormattedMessage
        id="sources.editSource"
        defaultMessage="Edit a source"
    />,
    name: 'step_1',
    stepKey: 1,
    nextStep: type,
    fields: [{
        component: componentTypes.TEXT_FIELD,
        name: 'source.name',
        type: 'text',
        label: <FormattedMessage
            id="sources.name"
            defaultMessage="Name"
        />,
        validate: [
            (value) => asyncValidator(value, sourceId)
        ],
        isRequired: true
    }, {
        component: componentTypes.SELECT_COMPONENT,
        name: 'source_type',
        label: <FormattedMessage
            id="sources.type"
            defaultMessage="Type"
        />,
        isRequired: true,
        isDisabled: true,
        readOnly: true, // make it grey ;-)
        options: compileAllSourcesComboOptions(sourceTypes),
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    }]
});

const summaryStep = (sourceTypes, applicationTypes) => ({
    fields: [{
        component: 'description',
        name: 'description',
        content: <TextContent>
            <Title headingLevel="h3" size="2xl">Review source details</Title>
            <FormattedMessage
                id="sources.summaryDescription"
                defaultMessage="Review source details and click Finish to complete source editing. Click Back to revise."
            />
        </TextContent>
    }, {
        name: 'summary',
        component: 'summary',
        sourceTypes,
        showApp: false,
        applicationTypes
    }],
    stepKey: 'summary',
    name: 'summary',
    title: <FormattedMessage
        id="sources.reviewSummary"
        defaultMessage="Review source details"
    />
});

export const initialValues = source => {
    const url = source.endpoint ? endpointToUrl(source.endpoint) : '';

    return {
        url,
        auth_select: source.authentication.authtype,
        endpoint: source.endpoint,
        authentication: source.authentication,
        source: source.source,
        source_type: source.source_type
    };
};

export function sourceEditForm(sourceTypes, source, applicationTypes) {
    const sourceType = sourceTypes && sourceTypes.find((type) => type.id === source.source_type_id);
    const typeName = sourceType.name;
    const DISABLE_AUTH_TYPE_SELECTION = true;

    return {
        initialValues: initialValues({ source_type: sourceType.name, ...source }),
        schemaType: 'default',
        showFormControls: false,
        schema: {
            fields: [{
                component: componentTypes.WIZARD,
                name: 'wizard',
                inModal: true,
                title: <FormattedMessage
                    id="sources.editSource"
                    defaultMessage="Edit a source"
                />,
                description: <FormattedMessage
                    id="sources.editSourceDescription"
                    defaultMessage="You are editing a source"
                />,
                buttonLabels: {
                    submit: <FormattedMessage
                        id="sources.finish"
                        defaultMessage="Finish"
                    />
                },
                fields: [
                    firstStepEdit(sourceTypes, typeName, source.id),
                    ...schemaBuilder(
                        sourceTypes.filter(({ name }) => name === typeName),
                        applicationTypes,
                        DISABLE_AUTH_TYPE_SELECTION
                    ),
                    summaryStep(sourceTypes)
                ]
            }]
        }
    };
}
