import React, { useEffect } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

import { Modal } from '@patternfly/react-core';
import { Spinner } from '@red-hat-insights/insights-frontend-components';

import { sourceEditForm, sourceNewForm } from '../SmartComponents/ProviderPage/providerForm';
import SourcesFormRenderer from '../Utilities/SourcesFormRenderer';
import { createSource, loadEntities, loadSourceForEdit, updateSource } from '../redux/actions/providers';
import { paths } from '../Routes';

const SourceEditModal = ({
    location: { pathname },
    match: { params: { id } },
    createSource,
    updateSource, history,
    loadSourceForEdit,
    source,
    sourceTypes,
    intl
}) => {
    const editorNew = pathname === paths.sourcesNew;

    useEffect(() => {
        if (!editorNew) {
            loadSourceForEdit(parseInt(id, 10));
        }
    }, []);

    const submitProvider = (values, _formState) => {
        const promise = editorNew ?
            createSource(
                values,
                sourceTypes,
                intl.formatMessage({
                    id: 'sources.addedNotification',
                    defaultMessage: `"{ name }" was added successfully.`
                }, { name: values.source_name  }),
                intl) :
            updateSource(
                source,
                values,
                intl.formatMessage({
                    id: 'sources.modifiedNotificationTitle',
                    defaultMessage: `"{ name }" was modified successfully.`
                }, { name: values.source_name  }),
                intl.formatMessage({
                    id: 'sources.modifiedNotificationDescription',
                    defaultMessage: 'The source was successfully modified.'
                }));

        promise.then(() => {
            history.replace('/');
            loadEntities();
        }).catch(_error => {
            history.replace('/');
        });
    };

    let form;

    if (sourceTypes && (editorNew || source)) {
        form = editorNew ?
            sourceNewForm(sourceTypes, intl) :
            sourceEditForm(sourceTypes, source, intl);
    }

    return (
        <Modal
            title={editorNew ?
                intl.formatMessage({
                    id: 'sources.addSource',
                    defaultMessage: 'Add a source'
                })
                :
                intl.formatMessage({
                    id: 'sources.editSource',
                    defaultMessage: 'Edit Source'
                })}
            isOpen
            onClose={history.goBack}
            isLarge>
            {(!sourceTypes || (!editorNew && !source)) ?
                <div className="ins-c-sources__dialog--spinnerContainer">
                    <Spinner />
                </div>
                :
                <SourcesFormRenderer
                    initialValues={form.initialValues}
                    schemaType={form.schemaType}
                    schema={form.schema}
                    uiSchema={form.uiSchema}
                    showFormControls={form.showFormControls}
                    onSubmit={submitProvider}
                    onCancel={history.goBack}
                />
            }
        </Modal>
    );
};

SourceEditModal.propTypes = {
    createSource: PropTypes.func.isRequired,
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
    { createSource, loadEntities, loadSourceForEdit, updateSource }, dispatch);

const mapStateToProps = ({ providers: { source, sourceTypes } }) => (
    { source, sourceTypes }
);

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(withRouter(SourceEditModal)));
