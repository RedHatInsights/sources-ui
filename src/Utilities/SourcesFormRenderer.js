import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import { mapperExtension } from '@redhat-cloud-services/frontend-components-sources';

import Description from '../components/Description';
import AddApplicationSummary from '../components/AddApplication/AddApplicationSummary';

const SourcesFormRenderer = props => (
    <FormRenderer
        layoutMapper={layoutMapper}
        formFieldsMapper={{
            ...formFieldsMapper,
            ...mapperExtension,
            description: Description,
            'add-application-summary': AddApplicationSummary
        }}
        {...props} />
);

export default SourcesFormRenderer;
