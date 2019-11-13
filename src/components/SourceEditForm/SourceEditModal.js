import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { Wizard } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';

import { sourceEditForm } from './editSourceSchema';
import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';
import { loadEntities, loadSourceForEdit, updateSource } from '../../redux/actions/providers';

const SourceEditModal = ({ match: { params: { id } }, history }) => {
    const [loading, setLoading] = useState(true);
    const intl = useIntl();

    const source = useSelector(({ providers }) => providers.source);
    const sourceTypes = useSelector(({ providers }) => providers.sourceTypes);
    const appTypes = useSelector(({ providers }) => providers.appTypes);
    const sourceTypesLoaded = useSelector(({ providers }) => providers.sourceTypesLoaded);
    const appTypesLoaded = useSelector(({ providers }) => providers.appTypesLoaded);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(loadSourceForEdit(id)).then(() => setLoading(false));
    }, []);

    const submitProvider = (values) => dispatch(updateSource(
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
        }))
    .then(() => {
        history.push('/');
        dispatch(loadEntities());
    }).catch(_error => {
        history.push('/');
    });

    if (!appTypesLoaded || !sourceTypesLoaded || !source || loading) {
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
    match: PropTypes.object.isRequired,
    history: PropTypes.any.isRequired
};

export default withRouter(SourceEditModal);
