import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import {
    TextContent,
    Text,
    TextVariants
} from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';
import { schemaBuilder } from '@redhat-cloud-services/frontend-components-sources';
import get from 'lodash/get';

import AddApplicationDescription from './AddApplicationDescription';
import { AuthTypeSetter } from './AuthTypeSetter';

export const NoAvailableApplicationDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="sources.allApplicationsAssigned"
            defaultMessage="All available applications have already been added to this source
        or there is no available application for this source type."
        />
    </Text>
</TextContent>);

export const ApplicationSummary = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="sources.reviewAddAppSummary"
            defaultMessage="Review the information below and click Finish to add the application to your source."
        /> <br />
        <FormattedMessage
            id="sources.backGuide"
            defaultMessage="Use the Back button to make changes."
        />
    </Text>
</TextContent>);

export const hasAlreadySupportedAuthType = (authValues = [], appType, sourceTypeName) =>
    authValues.find(({ authtype }) => authtype === get(appType, `supported_authentication_types.${sourceTypeName}[0]`));

const fields = (applications = [], intl, sourceTypes, applicationTypes, authenticationValues, source) => {
    const hasAvailableApps = applications.length > 0;

    let nextStep = hasAvailableApps ? 'summary' : undefined;
    let authenticationFields = [];

    if (!source.imported && hasAvailableApps) {
        const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id);

        const appendEndpoint = sourceType.schema.endpoint.hidden ? sourceType.schema.endpoint.fields : [];
        const hasEndpointStep = appendEndpoint.length === 0;

        applicationTypes.forEach(appType => {
            if (appType.supported_source_types.includes(sourceType.name)) {
                const doNotRequirePasswords = hasAlreadySupportedAuthType(authenticationValues, appType, sourceType.name);

                authenticationFields.push(
                    schemaBuilder.createSpecificAuthTypeSelection(
                        sourceType,
                        appType,
                        appendEndpoint,
                        false,
                        doNotRequirePasswords
                    )
                );
            }
        });

        sourceType.schema.authentication.forEach(auth => {
            applicationTypes.forEach(appType => {
                if (appType.supported_source_types.includes(sourceType.name)) {
                    const appAdditionalSteps = schemaBuilder.getAdditionalSteps(sourceType.name, auth.type, appType.name);

                    if (appAdditionalSteps.length > 0) {
                        const doNotRequirePasswords = hasAlreadySupportedAuthType(authenticationValues, appType, sourceType.name);

                        authenticationFields.push(
                            ...schemaBuilder.createAdditionalSteps(
                                appAdditionalSteps,
                                sourceType.name,
                                auth.type,
                                hasEndpointStep,
                                auth.fields,
                                appType.name,
                                doNotRequirePasswords
                            )
                        );
                    }
                }
            });
        });

        if (hasEndpointStep) {
            authenticationFields.push(schemaBuilder.createEndpointStep(sourceType.schema.endpoint, sourceType.name));
        }

        nextStep = ({ values: { application } }) => {
            const app = application ? application : {};
            const appId = app.application_type_id ? app.application_type_id : '';

            return `${sourceType.name}-${appId}`;
        };
    }

    const applicationSelection = hasAvailableApps ? {
        component: 'card-select',
        name: 'application.application_type_id',
        options: applications,
        label: intl.formatMessage({
            id: 'sources.chooseAppToAdd',
            defaultMessage: 'Choose an application to add'
        }),
        DefaultIcon: null,
        isRequired: true,
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    } : {
        component: 'description',
        name: 'description-no-options',
        validate: [{
            type: validatorTypes.REQUIRED
        }],
        Content: NoAvailableApplicationDescription
    };

    return ({
        fields: [
            {
                component: componentTypes.WIZARD,
                name: 'wizard',
                title: intl.formatMessage({
                    id: 'sources.manageApps',
                    defaultMessage: 'Manage applications'
                }),
                inModal: true,
                predictSteps: true,
                showTitles: true,
                description: intl.formatMessage({
                    id: 'sources.addAppDescription',
                    defaultMessage: 'You are managing applications of this source'
                }),
                buttonLabels: {
                    submit: intl.formatMessage({
                        id: 'sources.finish',
                        defaultMessage: 'Finish'
                    }),
                    cancel: intl.formatMessage({
                        id: 'sources.cancel',
                        defaultMessage: 'Cancel'
                    }),
                    back: intl.formatMessage({
                        id: 'sources.back',
                        defaultMessage: 'Back'
                    })
                },
                fields: [
                    {
                        nextStep,
                        title: intl.formatMessage({
                            id: 'sources.selectApp',
                            defaultMessage: 'Select application'
                        }),
                        stepKey: 1,
                        fields: [
                            {
                                component: 'description',
                                name: 'description',
                                Content: AddApplicationDescription
                            },
                            applicationSelection,
                            {
                                component: 'description',
                                name: 'authtypesetter',
                                Content: AuthTypeSetter,
                                authenticationValues,
                                hideField: true
                            }]
                    }, {
                        title: intl.formatMessage({
                            id: 'sources.review',
                            defaultMessage: 'Review'
                        }),
                        stepKey: 'summary',
                        fields: [{
                            component: 'description',
                            name: 'description-summary',
                            Content: ApplicationSummary
                        }, {
                            component: 'summary',
                            name: 'summary',
                            sourceTypes,
                            applicationTypes
                        }]
                    },
                    ...authenticationFields
                ]
            }
        ]
    });
};

export default fields;
