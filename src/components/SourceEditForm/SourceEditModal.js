import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';

import { layoutMapper } from '@data-driven-forms/pf4-component-mapper';
import { Modal } from '@patternfly/react-core/dist/js/components/Modal';

import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import HorizontalFormWrapper from './HorizontalFormWrapper';
import Header from './Header';
import { onSubmit } from './onSubmit';

import { redirectWhenImported } from './importedRedirect';
import { routes } from '../../Routes';
import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import reducer, { initialState } from './reducer';
import sourceEditContext from './sourceEditContext';

const SourceEditModal = () => {
    const [state, setState] = useReducer(reducer, initialState);
    const history = useHistory();
    const sourceRedux = useSource();
    const isLoaded = useIsLoaded();

    const { loading, editing, source, initialValues, schema } = state;

    const intl = useIntl();

    const {
        sourceTypes,
        appTypes,
        sourceTypesLoaded,
        appTypesLoaded
    } = useSelector(({ sources }) => sources, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        if (sourceRedux) {
            doLoadSourceForEdit(sourceRedux).then((source) => {
                if (source.source.imported) {
                    redirectWhenImported(dispatch, intl, history, source.source.name);
                }

                setState({ type: 'setSource', source });
            });
        }
    }, [sourceRedux, isLoaded]);

    const setEdit = (name) => setState({ type: 'setEdit', name });

    useEffect(() => {
        if (source && appTypesLoaded && sourceTypesLoaded) {
            const sourceType = sourceTypes.find(({ id }) => id === source.source.source_type_id);

            setState({ type: 'createForm', sourceType, source, setEdit, appTypes });
        }
    }, [appTypesLoaded, source, sourceTypesLoaded]);

    useEffect(() => {
        if (source && !loading) {
            setState({ type: 'refreshSchema', setEdit, appTypes });
        }
    }, [editing]);

    const isLoading = !appTypesLoaded || !sourceTypesLoaded || loading;

    const returnToSources = () => history.push(routes.sources.path);

    if (isLoading) {
        return (
            <Modal
                title={intl.formatMessage({
                    id: 'sources.editSource',
                    defaultMessage: 'Edit source.'
                })}
                header={<Header />}
                isOpen={true}
                isLarge
                onClose={returnToSources}
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
                defaultMessage: 'Edit source.'
            })}
            header={<Header />}
            isOpen={true}
            isLarge
            onClose={returnToSources}
        >
            <sourceEditContext.Provider value={{ setState }}>
                <SourcesFormRenderer
                    onCancel={returnToSources}
                    schema={schema}
                    onSubmit={
                        (values, formApi) =>
                            onSubmit(values, formApi.getState().dirtyFields, dispatch, source, intl, history.push)
                    }
                    layoutMapper={{
                        ...layoutMapper,
                        FormWrapper: HorizontalFormWrapper
                    }}
                    clearedValue={null}
                    canReset
                    disableSubmit={['submitting']}
                    onReset={() => setState({ type: 'reset' })}
                    initialValues={initialValues}
                    buttonsLabels={{ submitLabel: intl.formatMessage({
                        id: 'sources.save',
                        defaultMessage: 'Save'
                    }) }}
                />
            </sourceEditContext.Provider>
        </Modal>
    );
};

export default SourceEditModal;
