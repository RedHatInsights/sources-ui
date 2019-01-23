export const providerForm = {
    schemaType: 'mozilla',
    schema: {
        title: 'Add an Openshift Provider',
        type: 'object',
        properties: {
            name: { title: 'Provider Name', type: 'string' },
            description: { title: 'Description', type: 'string' },
            url: { title: 'URL', type: 'string' },
            verify_ssl: { title: 'Verify SSL', type: 'boolean', default: false },
            user: { title: 'User Name', type: 'string', default: '' },
            token: { title: 'Token', type: 'string', default: '' },
            password: { title: 'Password', type: 'string', minlength: 6 }
        },
        required: ['name', 'url']
    },
    uiSchema: {
        password: { 'ui:widget': 'password' }
    }
};

import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
export const wizardForm = {
    initialValues: {
        role: 'kubernetes',
        verify_ssl: true
    },
    schemaType: 'default',
    showFormControls: false,
    schema: {
        fields: [{
            component: componentTypes.WIZARD,
            name: 'wizzard',
            assignFieldProvider: true,
            fields: [{
                title: 'Get started with adding source',
                name: 'step-1',
                stepKey: 1,
                nextStep: {
                    when: 'source-type',
                    stepMapper: {
                        aws: 'aws',
                        google: 'google',
                        openshift: 'openshift'
                    }
                },
                fields: [{
                    component: componentTypes.TEXT_FIELD,
                    name: 'source_name',
                    type: 'text',
                    label: 'Name'
                }, {
                    component: componentTypes.SELECT_COMPONENT,
                    name: 'source-type',
                    label: 'Source type',
                    isRequired: true,
                    options: [{
                        label: 'Please Choose'
                    }, {
                        value: 'openshift',
                        label: 'OpenShift'
                    }, {
                        value: 'aws',
                        label: 'AWS EC2'
                    }, {
                        value: 'google',
                        label: 'Google Compute'
                    }],
                    validate: [{
                        type: validatorTypes.REQUIRED
                    }]
                }]
            }, {
                title: 'Configure OpenShift',
                name: 'step-4',
                stepKey: 'openshift',
                nextStep: 'summary',
                fields: [{
                    component: componentTypes.TEXT_FIELD,
                    name: 'role',
                    type: 'hidden'
                }, {
                    component: componentTypes.TEXT_FIELD,
                    name: 'url',
                    label: 'URL'
                }, {
                    component: componentTypes.CHECKBOX,
                    name: 'verify_ssl',
                    label: 'Verify SSL'
                }, {
                    component: componentTypes.TEXT_FIELD,
                    name: 'certificate_authority',
                    label: 'Certificate Authority',
                    condition: {
                        when: 'verify_ssl',
                        is: true
                    }
                }, {
                    component: componentTypes.TEXTAREA_FIELD,
                    name: 'token',
                    label: 'Token'
                }]
            }, {
                title: 'Configure AWS',
                name: 'step-2',
                stepKey: 'aws',
                nextStep: 'summary',
                fields: [{
                    component: componentTypes.TEXT_FIELD,
                    name: 'aws-field',
                    label: 'Aws field part'
                }]
            }, {
                stepKey: 'google',
                title: 'Configure google',
                name: 'step-3',
                nextStep: 'summary',
                fields: [{
                    component: componentTypes.TEXT_FIELD,
                    name: 'google-field',
                    label: 'Google field part'
                }]
            }, {
                fields: [{
                    name: 'summary',
                    component: 'summary',
                    assignFieldProvider: true
                }],
                stepKey: 'summary',
                name: 'summary'
            }]
        }]
    },
    uiSchema: {
    //password: {'ui:widget': 'password'}
    }
};
