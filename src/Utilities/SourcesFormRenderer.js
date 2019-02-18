import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';

const Summary = ({ FieldProvider }) => (
    <div>
        <FieldProvider name="source_name">
            {({ input: { value } }) => <span>Creating a new source named &quot;{value}&quot; </span>}
        </FieldProvider>
        <FieldProvider name="source_type">
            {({ input: { value } }) => <span>of type: <b>{value}</b></span>}
        </FieldProvider>
    </div>
);

Summary.propTypes = {
    FieldProvider: PropTypes.func.isRequired
};

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
