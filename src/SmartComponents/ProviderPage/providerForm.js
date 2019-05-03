import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import zipObject from 'lodash/zipObject';
import find from 'lodash/find';
import React from 'react';
import { QuestionCircleIcon } from '@patternfly/react-icons';
import { Popover, TextContent, TextList, TextListItem } from '@patternfly/react-core';
import SSLFormLabel from '../../components/SSLFormLabel';
import { sourceTypeStrFromLocation } from '../../api/entities';

const compileAllSourcesComboOptions = (sourceTypes) => (
    [{ label: 'Choose a type' }].concat(
        sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    )
);

const compileSourcesComboOptions = (sourceTypes) => {
    // temporarily we limit the sources offered based on URL
    const sourceTypeStr = sourceTypeStrFromLocation();

    return compileAllSourcesComboOptions(sourceTypeStr ?
        sourceTypes.filter(type => type.name === sourceTypeStr) : sourceTypes);
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
            title: 'Add source credentials',
            description: <React.Fragment key='1'>
                <TextContent>
                    Add credentials that enable communication with this source. This source requires the login token.
                </TextContent>
                <TextContent>
                    To collect data from a Red Hat OpenShift Container Platform source,
                </TextContent>
                <TextContent>
                    <TextList component='ul'>
                        <TextListItem component='li' key='1'>
                            Log in to the Red Hat OpenShift Container Platform cluster with an account
                            that has access to the namespace
                        </TextListItem>
                        <TextListItem component='li' key='2'>
                            Run the following command to obtain your login token: <b>
                            &nbsp;# oc sa get-token -n management-infra management-admin</b>
                        </TextListItem>
                        <TextListItem component='li' key='3'>Copy the token and paste it in the following field.</TextListItem>
                    </TextList>
                </TextContent>
            </React.Fragment>,
            fields: [{
                component: componentTypes.TEXTAREA_FIELD,
                name: 'token',
                label: 'Token'
            }]
        }, {
            title: 'Enter OpenShift Container Platform information',
            description: <React.Fragment key='2'>
                <p>
                    Provide OpenShift Container Platform URL and SSL certificate.
                </p>
            </React.Fragment>,
            fields: [{
                component: componentTypes.TEXT_FIELD,
                name: 'role',
                type: 'hidden',
                initialValue: 'kubernetes' // value of 'role' for the endpoint
            }, {
                component: componentTypes.TEXT_FIELD,
                name: 'url',
                label: 'URL',
                helperText: 'For example, https://myopenshiftcluster.mycompany.com',
                isRequired: true
            }, {
                component: componentTypes.CHECKBOX,
                name: 'verify_ssl',
                label: 'Verify SSL'
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
        title: <p>
            <span>Configure account access</span>&nbsp;
            <Popover
                aria-label="Help text"
                position="bottom"
                maxWidth="50%"
                bodyContent={
                    <React.Fragment>
                        <div>
                            Red Had recommends using the Power User AWS
                            Identity and Access Management (IAM) policy when adding an
                            AWS account as a source. This Policy allows the user full
                            access to API functionality and AWS services for user
                            administration.
                            <br />
                            Create an access key in the <b>Security
                            Credentials</b> area of your AWS user account. To add your
                            account as a source, enter the access key ID and secret
                            access key to act as your user ID and password.
                        </div>
                    </React.Fragment>
                }
                footerContent={<a href='http://foo.bar'>Learn more</a>}
            >
                <QuestionCircleIcon />
            </Popover>
        </p>,
        description: <React.Fragment>
            <p>
                Create an access key in your AWS user account and enter the details below.
            </p>
            <p>
                For sufficient access and security, Red Hat recommends using the Power User IAM polocy for your AWS user account.
            </p>
            <p>
                All fields are required.
            </p>
        </React.Fragment>,
        fields: [{
            component: componentTypes.TEXT_FIELD,
            name: 'role',
            type: 'hidden',
            initialValue: 'aws' // value of 'role' for the endpoint
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'user_name',
            label: 'Access Key ID',
            helperText: 'For example, AKIAIOSFODNN7EXAMPLE',
            isRequired: true
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'password',
            label: 'Secret Key',
            type: 'password',
            helperText: 'For example, wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
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

/* return hash of form: { amazon: 'amazon', google: 'google', openshift: 'openshift' } */
const compileStepMapper = (sourceTypes) => {
    const names = sourceTypes.map(t => t.name);
    return zipObject(names, names);
};

const firstStepNew = (sourceTypes) => ({
    title: 'Select a source type',
    description: <React.Fragment>
        <p>
            To import data for an application, you need to connect to a data source.
            To begin, input a name and select the type of source you want to collect data from.
        </p>
        <p>
            All fields are required.
        </p>
    </React.Fragment>,
    name: 'step_1',
    stepKey: 'step_1',
    nextStep: {
        when: 'source_type',
        stepMapper: compileStepMapper(sourceTypes)
    },
    fields: [{
        component: componentTypes.TEXT_FIELD,
        name: 'source_name',
        type: 'text',
        label: 'Name',
        helperText: 'For example, Source_1',
        isRequired: true,
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    }, {
        component: componentTypes.SELECT_COMPONENT,
        name: 'source_type',
        label: 'Type',
        isRequired: true,
        options: compileSourcesComboOptions(sourceTypes),
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    }]
});

const firstStepEdit = (sourceTypes, type) => ({
    title: 'Edit a source',
    name: 'step_1',
    stepKey: 'step_1',
    nextStep: type,
    fields: [{
        component: componentTypes.TEXT_FIELD,
        name: 'source_name',
        type: 'text',
        label: 'Name'
    }, {
        component: componentTypes.SELECT_COMPONENT,
        name: 'source_type',
        label: 'Source type',
        isRequired: true,
        isDisabled: true,
        readOnly: true, // make it grey ;-)
        options: compileSourcesComboOptions(sourceTypes),
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    }]
});

const summaryStep = () => ({
    fields: [{
        name: 'summary',
        component: 'summary'
    }],
    stepKey: 'summary',
    name: 'summary',
    title: 'Review source details',
    description: <TextContent>
        Review source details and click Add source to complete source creation. Click Back to revise.
    </TextContent>
});

const sourceTypeSteps = sourceTypes =>
    sourceTypes.map(t => fieldsToSteps(sourceTypeSchema(t), t.name, 'summary'))
    .flat(1);

const endpointToUrl = endpoint => (
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
        user_name: '',  // never loaded (part of authentication)
        password: ''    // same as token
    };
};

export function sourceEditForm(sourceTypes, source) {
    /* editing form:
     * 1st page: editable name + non-editable source type
     * 2nd, 3rd... page: provider specific
     * last page: summary */

    const sourceType = find(sourceTypes, { id: source.source_type_id });
    const typeName = sourceType.name;

    return {
        initialValues: initialValues({ source_type: sourceType.name, ...source }),
        schemaType: 'default',
        showFormControls: false,
        schema: {
            fields: [{
                component: componentTypes.WIZARD,
                name: 'wizard',
                fields: [firstStepEdit(sourceTypes, typeName)].concat(
                    sourceType &&
                        fieldsToSteps(sourceTypeSchema(sourceType), typeName, 'summary'),
                    summaryStep()
                )
            }]
        }
    };
}

export function sourceNewForm(sourceTypes) {
    /* For now we assume that each source has a schema with exactly 1 step.
     *
     * We prepend a page with source type choice and name.
     * And we append a page with a summary
     * */
    return {
        initialValues: {
            verify_ssl: true // for OpenShift
        },
        schemaType: 'default',
        showFormControls: false,
        schema: {
            fields: [{
                component: componentTypes.WIZARD,
                name: 'wizard',
                fields: [firstStepNew(sourceTypes)].concat(
                    sourceTypeSteps(sourceTypes),
                    summaryStep()
                )
            }]
        }
    };
}

