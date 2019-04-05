import { componentTypes, validatorTypes } from '@data-driven-forms/react-form-renderer';
import zipObject from 'lodash/zipObject';
import find from 'lodash/find';

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
        fields: [{
            component: componentTypes.TEXT_FIELD,
            name: 'role',
            type: 'hidden',
            initialValue: 'kubernetes' // value of 'role' for the endpoint
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
            component: componentTypes.TEXT_FIELD,
            name: 'token',
            label: 'Token',
            type: 'password'
        }]
    },
    amazon: {
        title: 'Configure AWS',
        fields: [{
            component: componentTypes.TEXT_FIELD,
            name: 'role',
            type: 'hidden',
            initialValue: 'aws' // value of 'role' for the endpoint
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'user_name',
            label: 'Access Key'
        }, {
            component: componentTypes.TEXT_FIELD,
            name: 'password',
            label: 'Secret Key',
            type: 'password'
        }]
    }
};

/* Switch between using hard-coded provider schemas and schemas from the api/source_types */
const sourceTypeSchemaWithFallback = t => (t.schema || temporaryHardcodedSourceSchemas[t.name]);
const sourceTypeSchemaHardcoded = t => temporaryHardcodedSourceSchemas[t.name];
const sourceTypeSchemaServer = t => t.schema;

const schemaMode = 0; // defaults to 0
const sourceTypeSchema = {
    0: sourceTypeSchemaWithFallback,
    1: sourceTypeSchemaHardcoded,
    2: sourceTypeSchemaServer
}[schemaMode];

/* return hash of form: { amazon: 'amazon', google: 'google', openshift: 'openshift' } */
const compileStepMapper = (sourceTypes) => {
    const names = sourceTypes.map(t => t.name);
    return zipObject(names, names);
};

const firstStepNew = (sourceTypes) => ({
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
    name: 'summary'
});

const sourceTypeSteps = sourceTypes =>
    sourceTypes.map(t => fieldsToStep(sourceTypeSchema(t), t.name, 'summary'));

const endpointToUrl = endpoint => (
    `${endpoint.scheme}://${endpoint.host}:${endpoint.port}${endpoint.path || ''}`
);

const initialValues = source => ({
    source_name: source.name,
    source_type: source.source_type,
    url: endpointToUrl(source.endpoint),
    verify_ssl: source.endpoint.verify_ssl,
    certificate_authority: source.endpoint.certificate_authority,
    token: 'FIXME',
    role: source.endpoint.role,
    // AWS?
    user_name: 'FIXME',
    password: 'FIXME' // same as token
});

export function sourceEditForm(sourceTypes, source) {
    /* editing form:
     * 1st page: editable name + non-editable source type
     * 2nd page: provider specific
     * 3rd page: summary */

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
                        fieldsToStep(sourceTypeSchema(sourceType), typeName, 'summary'),
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
