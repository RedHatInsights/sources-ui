import React from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import { mapperExtension } from '@redhat-cloud-services/frontend-components-sources';

import EditField from '../components/editField/EditField';

const SourcesFormRenderer = props => (
    <FormRenderer
        layoutMapper={layoutMapper}
        formFieldsMapper={{
            ...formFieldsMapper,
            ...mapperExtension,
            'edit-field': EditField
        }}
        {...props}
    />
);

export default SourcesFormRenderer;
