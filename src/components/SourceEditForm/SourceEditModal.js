import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Modal } from '@patternfly/react-core';
import { Spinner } from '@redhat-cloud-services/frontend-components';
import { layoutMapper } from '@data-driven-forms/pf4-component-mapper';

import SourcesFormRenderer from '../../Utilities/SourcesFormRenderer';
import { parseSourceToSchema } from './parser/parseSourceToSchema';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import HorizontalFormWrapper from './HorizontalFormWrapper';
import Header from './Header';
import { prepareInitialValues } from './helpers';
import { onSubmit } from './onSubmit';

import { redirectWhenImported } from './importedRedirect';

const initialState = {
    loading: true,
    editing: {},
    source: undefined,
    initialValues: {},
    sourceType: undefined,
    schema: undefined
};

const reducer = (state, payload) => ({ ...state, ...payload });

const SourceEditModal = () => {
    const [state, setState] = useReducer(reducer, initialState);
    const { id } = useParams();
    const history = useHistory();

    const { loading, editing, source, initialValues, sourceType, schema } = state;

    const intl = useIntl();

    const {
        sourceTypes,
        appTypes,
        sourceTypesLoaded,
        appTypesLoaded
    } = useSelector(({ sources }) => sources, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        doLoadSourceForEdit(id).then((source) => {
            if (source.source.imported) {
                redirectWhenImported(dispatch, intl, history, source.source.name);
            }

            setState({ source });
        });
    }, []);

    const setEdit = (name) => setState({
        editing: {
            ...editing,
            [name]: !editing[name]
        }
    });

    useEffect(() => {
        if (source && appTypesLoaded && sourceTypesLoaded) {
            const sourceType = sourceTypes.find(({ id }) => id === source.source.source_type_id);

            setState({
                sourceType,
                initialValues: prepareInitialValues(source, sourceType.product_name),
                schema: parseSourceToSchema(source, editing, setEdit, sourceType, appTypes),
                loading: false
            });
        }
    }, [appTypesLoaded, source, sourceTypesLoaded]);

    useEffect(() => {
        if (source && !loading) {
            setState({
                schema: parseSourceToSchema(source, editing, setEdit, sourceType, appTypes)
            });
        }
    }, [editing]);

    const isLoading = !appTypesLoaded || !sourceTypesLoaded || loading;

    if (isLoading) {
        return (
            <Modal
                title={intl.formatMessage({
                    id: 'sources.editSource',
                    defaultMessage: 'Edit a source.'
                })}
                header={<Header />}
                isOpen={true}
                isLarge
                onClose={() => history.push('/')}
            >
                <div className="ins-c-sources__dialog--spinnerContainer">
                    <Spinner />
                </div>
            </Modal>
        );
    }

    return (
        <Modal
            title={intl.formatMessage({
                id: 'sources.editSource',
                defaultMessage: 'Edit a source.'
            })}
            header={<Header />}
            isOpen={true}
            isLarge
            onClose={() => history.push('/')}
        >
            <SourcesFormRenderer
                onCancel={() => history.push('/')}
                schema={schema}
                onSubmit={
                    (values, formApi) => onSubmit(values, formApi.getState().dirtyFields, dispatch, source, intl, history.push)
                }
                layoutMapper={{
                    ...layoutMapper,
                    FormWrapper: HorizontalFormWrapper
                }}
                canReset
                disableSubmit={['submitting']}
                onReset={() => setState({ editing: {} })}
                initialValues={initialValues}
                buttonsLabels={{ submitLabel: intl.formatMessage({
                    id: 'sources.save',
                    defaultMessage: 'Save'
                }) }}
            />
        </Modal>
    );
};

export default SourceEditModal;
