import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

import { FormGroup, TextInput } from '@patternfly/react-core';
import find from 'lodash/find';

const openShiftSummary = ({ url, certificate_authority }) => (
    <React.Fragment>
        <FormGroup
            label = {<FormattedMessage
                id="sources.url"
                defaultMessage="URL"
            />}
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
            label = {<FormattedMessage
                id="sources.sslCertificate"
                defaultMessage="SSL Certificate"
            />}
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

const awsSummary = ({ username, password }) => (
    <React.Fragment>
        <FormGroup
            label = {<FormattedMessage
                id="sources.accesKeyID"
                defaultMessage="Access Key ID"
            />}
            fieldId='summary-id'
        >
            <TextInput
                isDisabled
                type="text"
                id="summary-id"
                value={username}
            />
        </FormGroup>
        <FormGroup
            label = {<FormattedMessage
                id="sources.secretAccessKey"
                defaultMessage="Secret access key"
            />}
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
    username: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired
};

const typeSpecificSummary = (type, props) => type === 'openshift' ?
    openShiftSummary(props) : type === 'amazon' ?
        awsSummary(props) : null;

const niceTypeName = (name, types) => {
    const sourceType = find(types, { name });
    return sourceType && sourceType.product_name || name;
};

const SourceWizardSummary = ({ sourceTypes, formOptions }) => {
    const { source_name, source_type, ...rest } = formOptions.getState().values;
    console.log('source_type: ', source_type);
    return (
        <React.Fragment>
            <FormGroup
                label = {<FormattedMessage
                    id="sources.name"
                    defaultMessage="Name"
                />}
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
                label = {<FormattedMessage
                    id="sources.type"
                    defaultMessage="Type"
                />}
                fieldId="summary-type"
            >
                <TextInput
                    isDisabled
                    type="text"
                    id="summary-type"
                    value={niceTypeName(source_type, sourceTypes)}
                />
            </FormGroup>
            { typeSpecificSummary(source_type, rest) }
        </React.Fragment>
    );
};

SourceWizardSummary.propTypes = {
    formOptions: PropTypes.any.isRequired,
    sourceTypes: PropTypes.arrayOf(PropTypes.any).isRequired
};

const mapStateToProps = ({ providers: { sourceTypes } }) => ({ sourceTypes });

export default connect(mapStateToProps)(SourceWizardSummary);
