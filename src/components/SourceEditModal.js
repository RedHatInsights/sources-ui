import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Modal } from '@patternfly/react-core';

import { sourceEditForm, sourceNewForm } from '../SmartComponents/ProviderPage/providerForm';
import SourcesFormRenderer from '../Utilities/SourcesFormRenderer';
import { createSource, loadEntities, loadSourceForEdit } from '../redux/actions/providers';
import { paths } from '../Routes';

const SourceEditModal = props => {

    const editorNew = props.location.pathname === paths.sourcesNew;

    useEffect(() => {
        if (!editorNew) {
            props.loadSourceForEdit(parseInt(props.match.params.id, 10));
        }
    }, []);

    const submitProvider = (values, _formState) => {
        props.createSource(values, props.sourceTypes).then(() => {
            props.history.replace('/');
            props.loadEntities();
        }).catch(error => {
            console.log('CATCH:'); console.log(error);
            props.history.replace('/');
        });
    };

    if (! props.source) {
        return <div>Loading...</div>
    }

    const sourceTypes = props.sourceTypes || [];

    const form = editorNew ? sourceNewForm(sourceTypes) : sourceEditForm(sourceTypes, props.source);
    console.log('Form schema: ', form);

    return (
        <Modal
            title={editorNew ? 'Add a New Source' : 'Edit Source'}
            isOpen
            onClose={props.history.goBack}
            isLarge>

            <SourcesFormRenderer
                initialValues={form.initialValues}
                schemaType={form.schemaType}
                schema={form.schema}
                uiSchema={form.uiSchema}
                showFormControls={form.showFormControls}
                onSubmit={submitProvider}
            />
        </Modal>
    );
};

SourceEditModal.propTypes = {
    createSource: PropTypes.func.isRequired,
    loadSourceForEdit: PropTypes.func.isRequired,
    loadEntities: PropTypes.func.isRequired,

    sourceTypes: PropTypes.arrayOf(PropTypes.any), // list of all SourceTypes
    source: PropTypes.object, // a Source for editing

    location: PropTypes.any.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.any.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(
    { createSource, loadEntities, loadSourceForEdit }, dispatch);

const mapStateToProps = ({ providers: { source, sourceTypes } }) => (
    { source, sourceTypes }
);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SourceEditModal));
