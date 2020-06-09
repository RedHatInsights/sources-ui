import React from 'react';
import PropTypes from 'prop-types';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

import { FormattedMessage } from 'react-intl';
import * as schemaBuilder from '@redhat-cloud-services/frontend-components-sources/cjs/schemaBuilder';
import get from 'lodash/get';

import AddApplicationDescription from './AddApplicationDescription';
import { AuthTypeSetter } from './AuthTypeSetter';
import { AuthTypeCleaner } from './AuthTypeCleaner';

export const NoAvailableApplicationDescription = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="sources.allApplicationsAssigned"
            defaultMessage="All available applications have already been added to this source
        or there is no available application for this source."
        />
    </Text>
</TextContent>);

export const ApplicationSummary = () => (<TextContent>
    <Text component={ TextVariants.p }>
        <FormattedMessage
            id="sources.reviewAddAppSummary"
            defaultMessage="Review the information below and click Add to add the application to your source.
            Use the Back button to make changes."
        />
    </Text>
</TextContent>);

export const SelectAuthenticationDescription = ({ applicationTypeName, authenticationTypeName }) => (
    <TextContent>
        <Text component={ TextVariants.p }>
            <FormattedMessage
                id="sources.selectAuthenticationDescription"
                defaultMessage="Selected application { applicationTypeName } supports { authenticationTypeName } authentication
                type. You can use already defined authentication values or define new."
                values={{ applicationTypeName, authenticationTypeName }}
            />
        </Text>
    </TextContent>
);

SelectAuthenticationDescription.propTypes = {
    applicationTypeName: PropTypes.string,
    authenticationTypeName: PropTypes.string
};

export const hasAlreadySupportedAuthType = (authValues = [], appType, sourceTypeName) => (
    authValues.find(({ authtype }) => authtype === get(appType, `supported_authentication_types.${sourceTypeName}[0]`))
);

export const authenticationSelectionStep = (sourceType, appType, intl, authenticationValues) => {
    const nextStep = ({ values: { application, authtype } }) => {
        if (authtype) {
            const hasSupportedAuthType = authenticationValues.find((auth) => auth.authtype === authtype);

            if (hasSupportedAuthType) {
                return 'selectAuthentication';
            }

            return `${sourceType.name}-${application && application.application_type_id}-${authtype}`;
        }
    };

    return ({
        name: 'selectAuthType',
        title: intl.formatMessage({
            id: 'sources.selectAuthenticationTitle',
            defaultMessage: 'Select authentication type'
        }),
        fields: [{
            component: componentTypes.RADIO,
            name: 'authtype',
            options: appType.supported_authentication_types[sourceType.name].map(type => ({
                value: type,
                label: sourceType.schema.authentication.find((authtype) => authtype.type === type)?.name || 'unknown name'
            })),
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }]
        }],
        nextStep
    });
};

const generateAuthSelectionOptions = ({
    source, authenticationValues, applicationTypes, supportedAuthTypeName, supportedAuthType
}) => authenticationValues.filter(({ authtype }) => authtype === supportedAuthType).map((values) => {
    const app = source.applications.find(({ authentications }) => authentications.find(({ id }) => id === values.id));

    const appType = app && app.application_type_id ? applicationTypes.find(({ id }) => id === app.application_type_id) : '';

    const includeUsername = values.username ? `-${values.username}` : '';
    const includeAppName = appType ? `-${appType.display_name}` : `-unused-${values.id}`;
    const label = `${supportedAuthTypeName}${includeUsername}${includeAppName}`;

    return {
        label,
        value: values.id,
    };
});

export const selectAuthenticationStep = ({
    intl, source, authenticationValues, sourceType, applicationTypes, modifiedValues
}) => {
    const nextStep = ({ values: { application, authtype, authentication } }) => {
        const app = application ? application : {};
        const appId = app.application_type_id ? app.application_type_id : '';

        return `${sourceType.name}-${appId}-${authtype || authentication?.authtype}`;
    };

    const fields = [{
        component: 'description',
        name: 'authtypesetter',
        Content: AuthTypeSetter,
        authenticationValues,
        hideField: true,
        modifiedValues
    }];

    applicationTypes.forEach((app) => {
        const supportedAuthTypes = get(app, `supported_authentication_types[${sourceType.name}]`, []);

        supportedAuthTypes.forEach((supportedAuthType) => {
            const supportedAuthTypeName =
                get(sourceType, `schema.authentication`, {}).find(({ type }) => type === supportedAuthType).name;

            fields.push({
                component: componentTypes.SUB_FORM,
                name: `${app.name}-subform`,
                condition: {
                    and: [{
                        when: 'application.application_type_id',
                        is: app.id
                    },
                    ...(supportedAuthTypes.length > 1
                        ? [{
                            when: 'authtype',
                            is: supportedAuthType
                        }]
                        : []
                    )]
                },
                fields: [
                    {
                        name: `${app.name}-select-authentication-summary`,
                        component: 'description',
                        Content: SelectAuthenticationDescription,
                        applicationTypeName: app.display_name,
                        authenticationTypeName: supportedAuthTypeName,
                    },
                    {
                        component: componentTypes.RADIO,
                        name: 'selectedAuthentication',
                        label: intl.formatMessage({
                            id: 'sources.selectAuthenticationTitle',
                            defaultMessage: 'Select authentication'
                        }),
                        isRequired: true,
                        validate: [{ type: validatorTypes.REQUIRED }],
                        options: [
                            {
                                label: intl.formatMessage({
                                    id: 'sources.selectAuthenticationradioLabel',
                                    defaultMessage: 'Define new { supportedAuthTypeName }'
                                }, { supportedAuthTypeName }),
                                value: `new-${supportedAuthType}`
                            },
                            ...generateAuthSelectionOptions(
                                { authenticationValues, source, applicationTypes, supportedAuthTypeName, supportedAuthType }
                            )
                        ]
                    },
                ]
            });
        });
    });

    return ({
        name: 'selectAuthentication',
        title: intl.formatMessage({
            id: 'sources.selectAuthenticationTitle',
            defaultMessage: 'Select authentication'
        }),
        fields,
        nextStep
    });
};

const generateFirstAuthStep = (type, appType, endpointFields, authtype) => {
    const fields = [...endpointFields];

    const auth = type.schema.authentication.find(({ type }) => type === authtype);

    const additionalStepName = `${type.name}-${authtype}-${appType.name}-additional-step`;

    const skipEndpoint = schemaBuilder.shouldSkipEndpoint(type.name, authtype, appType.name);
    const customSteps = schemaBuilder.hasCustomSteps(type.name, authtype, appType.name);

    let nextStep;

    if (schemaBuilder.getAdditionalSteps(type.name, authtype, appType.name).length > 0) {
        nextStep = additionalStepName;
    } else if (endpointFields.length === 0 && !skipEndpoint) {
        nextStep = `${type.name}-endpoint`;
    } else {
        nextStep = 'summary';
    }

    const additionalIncludesStepKeys = schemaBuilder.getAdditionalStepKeys(type.name, authtype, appType.name);
    const hasCustomStep = schemaBuilder.shouldSkipSelection(type.name, authtype, appType.name);

    let stepProps = {};

    if (hasCustomStep) {
        const firstAdditonalStep = schemaBuilder.getAdditionalSteps(type.name, authtype, appType.name).find(({ name }) => !name);
        const additionalFields = schemaBuilder.getAdditionalStepFields(auth.fields, additionalStepName);

        if (firstAdditonalStep.nextStep) {
            nextStep = firstAdditonalStep.nextStep;
        } else if (endpointFields.length === 0 && !skipEndpoint && !customSteps) {
            nextStep = `${type.name}-endpoint`;
        } else {
            nextStep = 'summary';
        }

        stepProps = {
            ...firstAdditonalStep,
            fields: [
                ...fields,
                ...schemaBuilder.injectAuthFieldsInfo(
                    [...firstAdditonalStep.fields, ...additionalFields],
                    type.name,
                    auth.type,
                    appType.name
                )
            ]
        };
    }

    return ({
        name: `${type.name}-${appType.id}-${authtype}`,
        title: 'Configure credentials',
        fields: [
            ...fields,
            ...schemaBuilder.getAdditionalAuthFields(type.name, authtype, appType.name),
            ...schemaBuilder.injectAuthFieldsInfo(
                schemaBuilder.getNoStepsFields(auth.fields, additionalIncludesStepKeys),
                type.name,
                authtype,
                appType.name
            )
        ],
        nextStep,
        ...stepProps
    });
};

const fields = (
    applications = [], intl, sourceTypes, applicationTypes, authenticationValues, source, modifiedValues, container
) => {
    const hasAvailableApps = applications.length > 0;

    let nextStep = hasAvailableApps ? 'summary' : undefined;
    let authenticationFields = [];
    const sourceType = sourceTypes.find(({ id }) => id === source.source_type_id);

    if (!source.imported && hasAvailableApps) {
        const appendEndpoint = sourceType.schema.endpoint.hidden ? sourceType.schema.endpoint.fields : [];
        const hasEndpointStep = appendEndpoint.length === 0;

        applicationTypes.forEach(appType => {
            if (appType.supported_source_types.includes(sourceType.name)) {
                appType.supported_authentication_types[sourceType.name].forEach((authtype) => {
                    authenticationFields.push(
                        generateFirstAuthStep(
                            sourceType,
                            appType,
                            appendEndpoint,
                            authtype
                        )
                    );
                });
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
                                auth.fields,
                                appType.name,
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
            if (application) {
                const appType = applicationTypes.find(({ id }) => id === application.application_type_id);

                const hasMultipleAuthTypes = appType?.supported_authentication_types[sourceType.name]?.length > 1;

                if (hasMultipleAuthTypes) {
                    return 'selectAuthType';
                }

                if (
                    hasAlreadySupportedAuthType(
                        authenticationValues,
                        applicationTypes.find(({ id }) => id === application.application_type_id),
                        sourceType.name
                    )
                ) {
                    return 'selectAuthentication';
                }

                const authType = appType?.supported_authentication_types[sourceType.name][0];

                return `${sourceType.name}-${application && application.application_type_id}-${authType}`;
            }
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

    const selectionSteps = applicationTypes
    .filter(({ supported_source_types }) => supported_source_types.includes(sourceType.name))
    .map(app => authenticationSelectionStep(sourceType, app, intl, authenticationValues));

    if (!source.imported && hasAvailableApps) {
        selectionSteps.push(
            selectAuthenticationStep({ intl, source, authenticationValues, sourceType, applicationTypes, modifiedValues })
        );
    }

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
                container,
                predictSteps: true,
                showTitles: true,
                crossroads: ['application.application_type_id', 'selectedAuthentication', 'authtype'],
                description: intl.formatMessage({
                    id: 'sources.addAppDescription',
                    defaultMessage: 'You are managing applications of this source.'
                }),
                buttonLabels: {
                    submit: hasAvailableApps ? intl.formatMessage({
                        id: 'sources.add',
                        defaultMessage: 'Add'
                    }) : intl.formatMessage({
                        id: 'sources.close',
                        defaultMessage: 'Close'
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
                        name: 'selectAppStep',
                        fields: [
                            {
                                component: 'description',
                                name: 'description',
                                Content: AddApplicationDescription,
                                container
                            },
                            applicationSelection,
                            {
                                component: 'description',
                                name: 'authtypesetter',
                                Content: AuthTypeCleaner,
                                hideField: true,
                                modifiedValues
                            }
                        ]
                    }, {
                        title: intl.formatMessage({
                            id: 'sources.reviewDetails',
                            defaultMessage: 'Review details'
                        }),
                        name: 'summary',
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
                    ...selectionSteps,
                    ...authenticationFields
                ]
            }
        ]
    });
};

export default fields;
