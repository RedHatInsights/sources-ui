import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import zipObject from 'lodash/zipObject';

const compileSourcesComboOptions = (sourceTypes) => (
    [{ label: 'Please Choose' }].concat(
        sourceTypes.map(t => ({
            value: t.name,
            label: t.product_name
        }))
    )
);

const fieldsToStep = (fields, stepName, nextStep) => ({
    ...fields, // expected to include title and fields
    name: stepName,
    stepKey: stepName,
    nextStep
});

const temporaryHardcodedSourceSchemas = {
    openshift: {
        title: 'Configure OpenShift',
        /* fields: [{
            component: componentTypes.TEXT_FIELD,
            name: 'role',
            type: 'hidden'
        }, */
        fields: [{
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

console.log(JSON.stringify(temporaryHardcodedSourceSchemas.openshift));
console.log(JSON.stringify(temporaryHardcodedSourceSchemas.amazon));

/* Fall-back to hard-coded schemas */
const sourceTypeSchema = t => (t.schema || temporaryHardcodedSourceSchemas[t.name]);

/* return hash of form: { amazon: 'amazon', google: 'google', openshift: 'openshift' } */
const compileStepMapper = (sourceTypes) => {
    const names = sourceTypes.map(t => t.name);
    return zipObject(names, names);
};

const firstStep = (sourceTypes) => ({
    title: 'Get started with adding source',
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
    /* For now we assume that each source has a schema with exactly 1 step.
     *
     * We prepend a page with source type choice and name.
     * And we append a page with a summary
     * */
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
                fields: [firstStep(sourceTypes)].concat(
                    sourceTypes.map(t => fieldsToStep(sourceTypeSchema(t), t.name, 'summary')),
                    summaryStep()
                )
            }]
        },
        uiSchema: {
        //password: {'ui:widget': 'password'}
        }
    };
}

;
