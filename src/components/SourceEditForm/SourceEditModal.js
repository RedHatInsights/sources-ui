import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Wizard } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

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
    appTypes,
    sourceTypesLoaded,
    appTypesLoaded,
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
        }),
        {
            authentication: intl.formatMessage({
                id: 'sources.sourceEditAuthFailure',
                defaultMessage: 'Authentication update failure.'
            }),
            source: intl.formatMessage({
                id: 'sources.sourceEditFailure',
                defaultMessage: 'Source update failure.'
            }),
            endpoint: intl.formatMessage({
                id: 'sources.sourceEditEndpointFailure',
                defaultMessage: 'Endpoint update failure.'
            })
        })
    .then(() => {
        history.replace('/');
        loadEntities();
    }).catch(_error => {
        history.replace('/');
    });

    if (!appTypesLoaded || !sourceTypesLoaded || !source) {
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

    const form = sourceEditForm(sourceTypes, source, appTypes);

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
    appTypes: PropTypes.arrayOf(PropTypes.any),
    source: PropTypes.object, // a Source for editing
    sourceTypesLoaded: PropTypes.bool.isRequired,
    appTypesLoaded: PropTypes.bool.isRequired,

    location: PropTypes.any.isRequired,
    match: PropTypes.object.isRequired,
    history: PropTypes.any.isRequired,

    intl: PropTypes.object.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators(
    { loadEntities, loadSourceForEdit, updateSource }, dispatch);

const mapStateToProps = ({ providers: { source, sourceTypes, appTypes, sourceTypesLoaded, appTypesLoaded } }) => (
    { source, sourceTypes, appTypes, sourceTypesLoaded, appTypesLoaded }
);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(SourceEditModal)));
