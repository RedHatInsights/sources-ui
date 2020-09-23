import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';
import validatorMapper from '@data-driven-forms/react-form-renderer/dist/cjs/validator-mapper';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';

import { mapperExtension } from '@redhat-cloud-services/frontend-components-sources/cjs/sourceFormRenderer';

import Authentication from '../components/Authentication';

const SourcesFormRenderer = props => (
    <FormRenderer
        FormTemplate={FormTemplate}
        componentMapper={{
            ...componentMapper,
            ...mapperExtension,
            authentication: Authentication,
            'switch-field': componentMapper[componentTypes.SWITCH]
        }}
        validatorMapper={{
            'required-validator': validatorMapper[validatorTypes.REQUIRED],
            'pattern-validator': validatorMapper[validatorTypes.PATTERN],
            'min-length-validator': validatorMapper[validatorTypes.MIN_LENGTH],
            'url-validator': validatorMapper[validatorTypes.URL]
        }}
        {...props}
    />
);

export default SourcesFormRenderer;
