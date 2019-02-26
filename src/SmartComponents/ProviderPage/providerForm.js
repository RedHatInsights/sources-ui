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

const compileSourcesComboOptions = (sourceTypes) => (
    [{ label: 'Please Choose' }].concat(
        sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    )
);

const temporatyHardcodedSourceSchemas = {
    openshift: {
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
    },
    amazon: {
        title: 'Configure AWS',
        name: 'step-2',
        stepKey: 'amazon',
        nextStep: 'summary',
        fields: [{
            component: componentTypes.TEXT_FIELD,
            name: 'user_name',
            label: 'Access Key'
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'password',
            label: 'Secret Key'
        }]
    }
};

const compileStepMapper = (_sourceTypes) => ({
    amazon: 'amazon',
    google: 'google',
    openshift: 'openshift'
});

const firstStep = (sourceTypes) => ({
    title: 'Get started with adding source',
    name: 'step-1',
    stepKey: 1,
    nextStep: {
        when: 'source_type',
        stepMapper: compileStepMapper(sourceTypes)
    },
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
        options: compileSourcesComboOptions(sourceTypes),
        validate: [{
            type: validatorTypes.REQUIRED
        }]
    }]
});

const summaryStep = () => ({
    fields: [{
        name: 'summary',
        component: 'summary',
        assignFieldProvider: true
    }],
    stepKey: 'summary',
    name: 'summary'
});

export function wizardForm(sourceTypes) {
    return {
        initialValues: {
            role: 'kubernetes', // 'aws' for AWS EC2
            verify_ssl: true    // for OpenShift
        },
        schemaType: 'default',
        showFormControls: false,
        schema: {
            fields: [{
                component: componentTypes.WIZARD,
                name: 'wizzard',
                assignFieldProvider: true,
                fields: [
                    firstStep(sourceTypes),
                    temporatyHardcodedSourceSchemas.openshift,
                    temporatyHardcodedSourceSchemas.amazon,
                    summaryStep()
                ]
            }]
        },
        uiSchema: {
        //password: {'ui:widget': 'password'}
        }
    };
}

;
