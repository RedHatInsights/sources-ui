import React, { Component } from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer'
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper'

class SourcesFormRenderer extends Component {
    render = () => <FormRenderer layoutMapper={layoutMapper} formFieldsMapper={formFieldsMapper} {...this.props} />
}

export default SourcesFormRenderer;
