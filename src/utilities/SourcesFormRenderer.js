import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer/dist/esm/form-renderer';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/esm/component-mapper';

import { mapperExtension } from '@redhat-cloud-services/frontend-components-sources/esm/sourceFormRenderer';

import Authentication from '../components/Authentication';

const SourcesFormRenderer = (props) => (
  <FormRenderer
    FormTemplate={FormTemplate}
    componentMapper={{
      ...componentMapper,
      ...mapperExtension,
      authentication: Authentication,
    }}
    {...props}
  />
);

export default SourcesFormRenderer;
