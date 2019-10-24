import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import {
    TextContent,
    Text,
    TextVariants
} from '@patternfly/react-core';
import AddApplicationDescription from './AddApplicationDescription';
import { FormattedMessage } from 'react-intl';

// All apps are assigned, do not show review and let user close the form
const createNextStep = (apps) => apps.length > 0 ? { nextStep: 'summary' } : {};

const fields = (applications = [], intl) => ({
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
                    ...createNextStep(applications),
                    title: intl.formatMessage({
                        id: 'sources.selectApp',
                        defaultMessage: 'Select application'
                    }),
                    stepKey: 1,
                    fields: [{
                        component: 'description',
                        name: 'description',
                        Content: AddApplicationDescription
                    },
                    applications.length > 0 ? {
                        component: 'card-select',
                        name: 'application',
                        options: applications,
                        label: intl.formatMessage({
                            id: 'sources.chooseAppToAdd',
                            defaultMessage: 'Choose an application to add'
                        }),
                        DefaultIcon: () => <React.Fragment />, // eslint-disable-line
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
                        // eslint-disable-next-line react/display-name
                        Content: () => (<TextContent>
                            <Text component={ TextVariants.p }>
                                <FormattedMessage
                                    id="sources.allApplicationsAssigned"
                                    defaultMessage="All available applications have already been added to this source
                                    or there is no available application for this source type."
                                />
                            </Text>
                        </TextContent>)
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
                        // eslint-disable-next-line react/display-name
                        Content: () => (<TextContent>
                            <Text component={ TextVariants.p }>
                                <FormattedMessage
                                    id="sources.reviewAddAppSummary"
                                    // eslint-disable-next-line max-len
                                    defaultMessage="Review the information below and click Finish to add the application to your source."
                                /> <br />
                                <FormattedMessage
                                    id="sources.backGuide"
                                    defaultMessage="Use the Back button to make changes."
                                />
                            </Text>
                        </TextContent>)
                    }, {
                        component: 'add-application-summary',
                        name: 'summary'
                    }]
                }
            ]
        }
    ]
});

export default fields;
