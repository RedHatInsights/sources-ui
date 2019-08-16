import React from 'react';
import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import { Popover, TextContent, TextList, TextListItem, Title } from '@patternfly/react-core';

import SSLFormLabel from '../../components/SSLFormLabel';
import { sourceTypeStrFromLocation } from '../../api/entities';
import { FormattedMessage } from 'react-intl';

const compileAllSourcesComboOptions = (sourceTypes, intl) => (
    [
        { label: intl.formatMessage(
            {
                id: 'source.chooseType',
                defaultMessage: 'Choose a type'
            }
        )  },
        ...sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    ]
);

const compileSourcesComboOptions = (sourceTypes, intl) => {
    // temporarily we limit the sources offered based on URL
    const sourceTypeStr = sourceTypeStrFromLocation();

    return compileAllSourcesComboOptions(sourceTypeStr ?
        sourceTypes.filter(type => type.name === sourceTypeStr) : sourceTypes, intl);
};

const fieldsToStep = (fields, stepName, nextStep) => ({
    ...fields, // expected to include title and fields
    name: stepName,
    stepKey: stepName,
    nextStep
});

const indexedStepName = (base, index) => index === 0 ? base : `${base}_${index}`;

const fieldsToSteps = (fields, stepNamePrefix, lastStep) =>
    Array.isArray(fields) ?
        fields.map((page, index) =>
            fieldsToSteps(
                page,
                indexedStepName(stepNamePrefix, index),
                index < fields.length - 1 ? indexedStepName(stepNamePrefix, index + 1) : lastStep)
        ) : fieldsToStep(fields, stepNamePrefix, lastStep);

const temporaryHardcodedSourceSchemas = {
    openshift: [
        {
            title: <FormattedMessage
                id="source.addSourceCredentialTitle"
                defaultMessage="Add source credentials"
            />,
            fields: [{
                component: 'description',
                name: 'description',
                content: <React.Fragment key='1'>
                    <TextContent>
                        <FormattedMessage
                            id="source.addSourceCredentialTitle1"
                            defaultMessage="Add credentials that enable communication with this source.
                        This source requires the login token."
                        />
                    </TextContent>
                    <TextContent>
                        <FormattedMessage
                            id="source.addSourceCredentialTitle2"
                            defaultMessage="To collect data from a Red Hat OpenShift Container Platform source,"
                        />
                    </TextContent>
                    <TextContent>
                        <TextList component='ul'>
                            <TextListItem component='li' key='1'>
                                <FormattedMessage
                                    id="source.addSourceCredentialBody1"
                                    defaultMessage="Log in to the Red Hat OpenShift Container Platform cluster with an account
                                that has access to the namespace"
                                />
                            </TextListItem>
                            <TextListItem component='li' key='2'>
                                <FormattedMessage
                                    id="source.addSourceCredentialBody2"
                                    defaultMessage="Run the following command to obtain your login token:"
                                />
                                <b>&nbsp;# oc sa get-token -n management-infra management-admin</b>
                            </TextListItem>
                            <TextListItem component='li' key='3'>
                                <FormattedMessage
                                    id="source.addSourceCredentialBody3"
                                    defaultMessage="Copy the token and paste it in the following field."
                                />
                            </TextListItem>
                        </TextList>
                    </TextContent>
                </React.Fragment>
            }, {
                component: componentTypes.TEXTAREA_FIELD,
                name: 'token',
                label: <FormattedMessage
                    id="source.token"
                    defaultMessage="Token"
                />
            }]
        }, {
            title: <FormattedMessage
                id="source.openshiftPlatformTitle"
                defaultMessage="Enter OpenShift Container Platform information"
            />,
            fields: [{
                component: 'description',
                name: 'description',
                content: <React.Fragment key='2'>
                    <p>
                        <FormattedMessage
                            id="source.provideOpenshitURLSSL"
                            defaultMessage="Provide OpenShift Container Platform URL and SSL certificate."
                        />
                    </p>
                </React.Fragment>
            },
            {
                component: componentTypes.TEXT_FIELD,
                name: 'role',
                type: 'hidden',
                initialValue: 'kubernetes' // value of 'role' for the endpoint
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'authtype',
                initialValue: 'token'
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'url',
                label: <FormattedMessage
                    id="source.url"
                    defaultMessage="URL"
                />,
                helperText: <FormattedMessage
                    id="source.urlHelperText"
                    defaultMessage="For example, https://myopenshiftcluster.mycompany.com"
                />,
                isRequired: true
            }, {
                component: componentTypes.CHECKBOX,
                name: 'verify_ssl',
                label: <FormattedMessage
                    id="source.verifySSL"
                    defaultMessage="Verify SSL"
                />
            }, {
                component: componentTypes.TEXTAREA_FIELD,
                name: 'certificate_authority',
                label: <SSLFormLabel />,
                condition: {
                    when: 'verify_ssl',
                    is: true
                }
            }]
        }
    ],
    amazon: {
        title: <FormattedMessage
            id="source.confAccountAccess"
            defaultMessage="Configure account access"
        />,
        fields: [{
            component: 'description',
            name: 'description',
            content: <React.Fragment key='2'>
                <Title headingLevel="h1" size="2xl">
                    <FormattedMessage
                        id="source.confAccountAccess"
                        defaultMessage="Configure account access"
                    /><Popover
                        aria-label="Help text"
                        position="bottom"
                        maxWidth="50%"
                        bodyContent={
                            <React.Fragment>
                                <div>
                                    <FormattedMessage
                                        id="source.confAccountAccessAWSHelp1"
                                        defaultMessage="Red Had recommends using the Power User AWS
                                                    Identity and Access Management (IAM) policy when adding an
                                                    AWS account as a source. This Policy allows the user full
                                                    access to API functionality and AWS services for user
                                                    administration."/>
                                    <br />
                                    <FormattedMessage
                                        id="source.confAccountAccessAWSHelp2"
                                        defaultMessage="Create an access key in the"
                                    />
                                &nbsp;<b>
                                        <FormattedMessage
                                            id="source.confAccountAccessAWSHelp3"
                                            defaultMessage="Security
                                                    Credentials"
                                        />
                                    </b>&nbsp;
                                    <FormattedMessage
                                        id="source.confAccountAccessAWSHelp4"
                                        defaultMessage="area of your AWS user account. To add your
                                                    account as a source, enter the access key ID and secret
                                                    access key to act as your user ID and password."
                                    />
                                </div>
                            </React.Fragment>
                        }
                        footerContent={<a href='http://foo.bar'>
                            <FormattedMessage
                                id="source.learnMore"
                                defaultMessage="Learn more"
                            />
                        </a>}
                    >
                        <QuestionCircleIcon />
                    </Popover>
                </Title>
                <p>
                    <FormattedMessage
                        id="source.amazonDescription1"
                        defaultMessage="Create an access key in your AWS user account and enter the details below."
                    />
                </p>
                <p>
                    <FormattedMessage
                        id="source.amazonDescription2"
                        defaultMessage="For sufficient access and security, Red Hat recommends using
                    the Power User IAM polocy for your AWS user account."
                    />
                </p>
                <p>
                    <FormattedMessage
                        id="source.amazonDescription3"
                        defaultMessage="All fields are required."
                    />
                </p>
            </React.Fragment>
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'role',
            type: 'hidden',
            initialValue: 'aws' // value of 'role' for the endpoint
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'authtype',
            initialValue: 'access_key_secret_key'
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'username',
            label: <FormattedMessage
                id="sources.accesKeyID"
                defaultMessage="Access Key ID"
            />,
            helperText: <FormattedMessage
                id="sources.accesKeyIDExample"
                defaultMessage="For example, AKIAIOSFODNN7EXAMPLE"
            />,
            isRequired: true
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'password',
            label: <FormattedMessage
                id="sources.secretKey"
                defaultMessage="Secret Key"
            />,
            type: 'password',
            helperText: <FormattedMessage
                id="sources.secretKey"
                defaultMessage="For example, wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            />,
            isRequired: true
        }]
    },
    'mock-source': {
        title: 'Configure Mock Source',
        fields: [
            // Save to Endpoint
            {
                component: 'select-field',
                name: 'host',
                label: 'Config',
                validate: [{ type: 'required-validator' }],
                isRequired: true,
                initialValue: 'default',
                options: [
                    { label: 'Multi-threaded with events', value: 'default' },
                    { label: 'Single-threaded full refresh', value: 'simple' }
                ]
            },
            // Save to endpoint
            // FIXME: name => 'path'?
            {
                component: 'select-field',
                name: 'path',
                label: 'Amount',
                validate: [{ type: 'required-validator' }],
                isRequired: true,
                initialValue: 'default',
                options: [
                    { label: 'All collections | Small', value: 'small' },
                    { label: 'All collections | Medium', value: 'default' },
                    { label: 'All collections | Large', value: 'large' },
                    { label: 'Amazon | Small', value: 'amazon/small' },
                    { label: 'Amazon | Medium', value: 'amazon/default' },
                    { label: 'Amazon | Large', value: 'amazon/large' },
                    { label: 'Openshift | Small', value: 'openshift/small' },
                    { label: 'Openshift | Medium', value: 'openshift/default' },
                    { label: 'Openshift | Large', value: 'openshift/large' }
                ]
            }
        ]
    }
};

/* Switch between using hard-coded provider schemas and schemas from the api/source_types */
const sourceTypeSchemaHardcodedWithFallback = t => (temporaryHardcodedSourceSchemas[t.name] || t.schema);
const sourceTypeSchemaWithFallback = t => (t.schema || temporaryHardcodedSourceSchemas[t.name]);
const sourceTypeSchemaHardcoded = t => temporaryHardcodedSourceSchemas[t.name];
const sourceTypeSchemaServer = t => t.schema;

const schemaMode = 4; // defaults to 0
const sourceTypeSchema = {
    0: sourceTypeSchemaWithFallback,
    1: sourceTypeSchemaHardcoded,
    2: sourceTypeSchemaServer,
    4: sourceTypeSchemaHardcodedWithFallback
}[schemaMode];

const firstStepEdit = (sourceTypes, type, intl) => ({
    title: <FormattedMessage
        id="sources.editSource"
        defaultMessage="Edit a source"
    />,
    name: 'step_1',
    stepKey: 1,
    nextStep: type,
    fields: [{
        component: componentTypes.TEXT_FIELD,
        name: 'source_name',
        type: 'text',
        label: <FormattedMessage
            id="sources.name"
            defaultMessage="Name"
        />
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
        options: compileSourcesComboOptions(sourceTypes, intl),
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    }]
});

const summaryStep = () => ({
    fields: [{
        component: 'description',
        name: 'description',
        content: <TextContent>
            <FormattedMessage
                id="sources.summaryDescription"
                defaultMessage="Review source details and click Add source to complete source creation. Click Back to revise."
            />
        </TextContent>
    }, {
        name: 'summary',
        component: 'summary'
    }],
    stepKey: 'summary',
    name: 'summary',
    title: <FormattedMessage
        id="sources.reviewSummary"
        defaultMessage="Review source details"
    />
});

export const endpointToUrl = endpoint => (
    `${endpoint.scheme}://${endpoint.host}:${endpoint.port}${endpoint.path || ''}`
);

const initialValues = source => {
    const url = source.endpoint ? endpointToUrl(source.endpoint) : '';

    const {
        scheme,
        host,
        port,
        path,
        verify_ssl,
        certificate_authority,
        role
    } = source.endpoint || {};

    return {
        source_name: source.name,
        source_type: source.source_type,
        url,
        scheme,
        host,
        port,
        path,
        verify_ssl,
        certificate_authority,
        role,
        token: '',      // never loaded (part of authentication)
        username: '',  // never loaded (part of authentication)
        password: ''    // same as token
    };
};

export function sourceEditForm(sourceTypes, source, intl) {
    /* editing form:
     * 1st page: editable name + non-editable source type
     * 2nd, 3rd... page: provider specific
     * last page: summary */

    const sourceType = sourceTypes && sourceTypes.find((type) => type.id === source.source_type_id);
    const typeName = sourceType.name;

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
                    defaultMessage="Edit Source"
                />,
                description: <FormattedMessage
                    id="sources.sources.editSourceDescription"
                    defaultMessage="You are editing a source"
                />,
                fields: [firstStepEdit(sourceTypes, typeName, intl)].concat(
                    sourceType &&
                        fieldsToSteps(sourceTypeSchema(sourceType), typeName, 'summary'),
                    summaryStep()
                )
            }]
        }
    };
}
