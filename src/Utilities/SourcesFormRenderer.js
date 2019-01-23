import React, { Component } from 'react';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';

// FIXME: const Summary = props => <div>Summary of New Source details here</div>;
const Summary = () => <div>Summary of New Source details here</div>;

class SourcesFormRenderer extends Component {
    render = () => <FormRenderer
        layoutMapper={layoutMapper}
        formFieldsMapper={{
            ...formFieldsMapper,
            summary: Summary
        }}
        {...this.props} />
}

export default SourcesFormRenderer;
