import React, { Component } from 'react';
import PropTypes from 'prop-types';

import FormRenderer from '@data-driven-forms/react-form-renderer';
import { layoutMapper, formFieldsMapper } from '@data-driven-forms/pf4-component-mapper';
import { FormGroup, TextInput } from '@patternfly/react-core';

const openShiftSummary = ({ url, certificate_authority }) => (
    <React.Fragment>
        <FormGroup
            label='URL'
            fieldId='summary-url'
        >
            <TextInput
                isDisabled
                type="text"
                id="summary-url"
                value={url}
            />
        </FormGroup>
        <FormGroup
            label='SSL Certificate'
            fieldId='summary-ssl-cert'
        >
            <TextInput
                isDisabled
                type="text"
                id="summary-ssl-cert"
                value={certificate_authority}
            />
        </FormGroup>
    </React.Fragment>
);
openShiftSummary.propTypes = {
    url: PropTypes.string.isRequired,
    certificate_authority: PropTypes.string.isRequired
};

const awsSummary = ({ user_name, password }) => (
    <React.Fragment>
        <FormGroup
            label='Access Key ID'
            fieldId='summary-id'
        >
            <TextInput
                isDisabled
                type="text"
                id="summary-id"
                value={user_name}
            />
        </FormGroup>
        <FormGroup
            label='Secret access key'
            fieldId='summary-ssl-cert'
        >
            <TextInput
                isDisabled
                type="text"
                id="summary-ssl-cert"
                value={password}
            />
        </FormGroup>
    </React.Fragment>
);
awsSummary.propTypes = {
    user_name: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};

const typeSpecificSummary = (type, props) => type === 'openshift' ?
    openShiftSummary(props) : type === 'amazon' ?
        awsSummary(props) : null;

const Summary = ({ formOptions }) => {
    const { source_name, source_type, ...rest } = formOptions.getState().values;
    return (
        <React.Fragment>
            <FormGroup
                label='Name'
                fieldId="summary-name"
            >
                <TextInput
                    isDisabled
                    type="text"
                    id="summary-name"
                    value={source_name}
                />
            </FormGroup>
            <FormGroup
                label='Type'
                fieldId="summary-type"
            >
                <TextInput
                    isDisabled
                    type="text"
                    id="summary-type"
                    value={source_type}
                />
            </FormGroup>
            { typeSpecificSummary(source_type, rest) }
        </React.Fragment>
    );
};

Summary.propTypes = {
    formOptions: PropTypes.any.isRequired
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
