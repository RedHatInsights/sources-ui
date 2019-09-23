import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Wizard } from '@patternfly/react-core';
import { Spinner } from '@red-hat-insights/insights-frontend-components';

import { sourceEditForm } from './editSourceSchema';
import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';
import { loadEntities, loadSourceForEdit, updateSource } from '../../redux/actions/providers';

const SourceEditModal = ({
    match: { params: { id } },
    updateSource,
    history,
    loadSourceForEdit,
    source,
    sourceTypes,
    loadEntities,
    intl
}) => {
    useEffect(() => {
        loadSourceForEdit(parseInt(id, 10));
    }, []);

    const submitProvider = (values) => updateSource(
        source,
        values,
        intl.formatMessage({
            id: 'sources.modifiedNotificationTitle',
            defaultMessage: `"{ name }" was modified successfully.`
        }, { name: values.source.name }),
        intl.formatMessage({
            id: 'sources.modifiedNotificationDescription',
            defaultMessage: 'The source was successfully modified.'
        }))
    .then(() => {
        history.replace('/');
        loadEntities();
    }).catch(_error => {
        history.replace('/');
    });

    let form;

    if (sourceTypes && source) {
        form = sourceEditForm(sourceTypes, source);
    }

    if (!sourceTypes || !source) {
        return (
            <Wizard
                isOpen={ true }
                onClose={ history.goBack }
                title={
                    intl.formatMessage({
                        id: 'sources.editSource',
                        defaultMessage: 'Edit a source'
                    })
                }
                description={
                    intl.formatMessage({
                        id: 'sources.editSourceDescription',
                        defaultMessage: 'You are editing a source'
                    })
                }
                steps={ [{
                    name: 'Loading',
                    component: <div className="ins-c-sources__dialog--spinnerContainer">
                        <Spinner />
                    </div>,
                    isFinishedStep: true
                }] }
            />
        );
    }

    return (
        <SourcesFormRenderer
            initialValues={form.initialValues}
            schemaType={form.schemaType}
            schema={form.schema}
            uiSchema={form.uiSchema}
            showFormControls={form.showFormControls}
            onSubmit={submitProvider}
            onCancel={() => history.push('/')}
        />
    );
};

SourceEditModal.propTypes = {
    loadSourceForEdit: PropTypes.func.isRequired,
    loadEntities: PropTypes.func.isRequired,
    updateSource: PropTypes.func.isRequired,

    sourceTypes: PropTypes.arrayOf(PropTypes.any), // list of all SourceTypes
    source: PropTypes.object, // a Source for editing

    location: PropTypes.any.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.any.isRequired,

    intl: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(
    { loadEntities, loadSourceForEdit, updateSource }, dispatch);

const mapStateToProps = ({ providers: { source, sourceTypes } }) => (
    { source, sourceTypes }
);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(SourceEditModal)));
