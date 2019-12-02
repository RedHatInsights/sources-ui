import React from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import {
    TextContent,
    Text,
    TextVariants
} from '@patternfly/react-core';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useSource } from '../../hooks/useSource';
import { schemaBuilder } from '@redhat-cloud-services/frontend-components-sources';

import AddApplicationDescription from './AddApplicationDescription';

export const checkAuthTypeMemo = () => {
    let previousAuthType;

    return (newAuthType) => {
        if (previousAuthType === newAuthType) {
            return false;
        }

        previousAuthType = newAuthType;
        return true;
    };
};

const checkAuthType = checkAuthTypeMemo();

export const AuthTypeSetter = ({ formOptions, authenticationValues }) => {
    const { id } = useParams();
    const { appTypes, sourceTypes } = useSelector(({ providers }) => providers, shallowEqual);

    const source = useSource(id);
    const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id);

    const application = appTypes.find(({ id }) => id === formOptions.getState().values.application);
    const supported_auth_type = application ? application.supported_authentication_types[sourceType.name][0] : '';

    if (checkAuthType(supported_auth_type)) {
        formOptions.change('supported_auth_type', supported_auth_type);

        const hasAuthenticationAlready = authenticationValues.find(({ authtype }) => authtype === supported_auth_type);

        if (hasAuthenticationAlready) {
            formOptions.change('authentication', hasAuthenticationAlready);
        } else {
            formOptions.change('authentication', undefined);
        }
    }

    return (<React.Fragment>
        <pre>
            {JSON.stringify(formOptions.getState().values, null, 2)}
            <br />
            {JSON.stringify(authenticationValues, null, 2)}
        </pre>
    </React.Fragment>);
};

export const NoAvailableApplicationDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="sources.allApplicationsAssigned"
            defaultMessage="All available applications have already been added to this source
        or there is no available application for this source type."
        />
    </Text>
</TextContent>);

export const EmptyIcon = () => <React.Fragment />;

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

const fields = (applications = [], intl, sourceTypes, applicationTypes, authenticationValues, source) => {
    let nextStep = 'summary';
    let authenticationFields = [];

    if (!source.imported) {
        const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id);

        const appendEndpoint = sourceType.schema.endpoint.hidden ? sourceType.schema.endpoint.fields : [];
        const hasEndpointStep = appendEndpoint.length === 0;

        applicationTypes.forEach(appType => {
            if (appType.supported_source_types.includes(sourceType.name)) {
                authenticationFields.push(
                    schemaBuilder.createSpecificAuthTypeSelection(sourceType, appType, appendEndpoint, false)
                );
            }
        });

        sourceType.schema.authentication.forEach(auth => {
            applicationTypes.forEach(appType => {
                if (appType.supported_source_types.includes(sourceType.name)) {
                    const appAdditionalSteps = schemaBuilder.getAdditionalSteps(sourceType.name, auth.type, appType.name);

                    if (appAdditionalSteps.length > 0) {
                        authenticationFields.push(
                            ...schemaBuilder.createAdditionalSteps(
                                appAdditionalSteps,
                                sourceType.name,
                                auth.type,
                                hasEndpointStep,
                                auth.fields, appType.name
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
            if (applications.length === 0) {
                return undefined;
            }

            const app = application ? application : {};
            const appId = app.application_type_id ? app.application_type_id : '';

            return `${sourceType.name}-${appId}`;
        };
    }

    const applicationSelection = applications.length > 0 ? {
        component: 'card-select',
        name: 'application.application_type_id',
        options: applications,
        label: intl.formatMessage({
            id: 'sources.chooseAppToAdd',
            defaultMessage: 'Choose an application to add'
        }),
        DefaultIcon: EmptyIcon,
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
        validateOnMount: true,
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
                                authenticationValues
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
