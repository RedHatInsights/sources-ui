import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import { CardSelect, SourceWizardSummary } from '@redhat-cloud-services/frontend-components-sources';

import Description from '../components/Description';
import AddApplicationSummary from '../components/AddApplication/AddApplicationSummary';

const SourcesFormRenderer = props => (
    <FormRenderer
        layoutMapper={layoutMapper}
        formFieldsMapper={{
            ...formFieldsMapper,
            summary: SourceWizardSummary,
            description: Description,
            'card-select': CardSelect,
            'add-application-summary': AddApplicationSummary
        }}
        {...props} />
);

export default SourcesFormRenderer;
