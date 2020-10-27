import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';

import { Modal } from '@patternfly/react-core/dist/js/components/Modal';

import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import Header from './Header';
import { onSubmit } from './onSubmit';

import { redirectWhenImported } from './importedRedirect';
import { routes } from '../../Routes';
import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import reducer, { initialState } from './reducer';
import sourceEditContext from './sourceEditContext';
import ModalFormTemplate from '../ModalFormTemplate';
import SubmittingModal from './SubmittingModal';
import TimeoutedModal from './TimeoutedModal';
import ErroredModal from './ErroredModal';
import RemoveAuth from './parser/RemoveAuth';
import { hasCostManagement } from './helpers';

const SourceEditModal = () => {
  const [state, setState] = useReducer(reducer, initialState);
  const history = useHistory();
  const sourceRedux = useSource();
  const isLoaded = useIsLoaded();

  const {
    loading,
    editing,
    source,
    initialValues,
    schema,
    isSubmitting,
    initialLoad,
    message,
    submitError,
    isTimeouted,
    values,
    sourceType,
    isAuthRemoving,
  } = state;

  const intl = useIntl();

  const { sourceTypes, appTypes, sourceTypesLoaded, appTypesLoaded } = useSelector(({ sources }) => sources, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (sourceRedux && initialLoad && appTypesLoaded) {
      doLoadSourceForEdit(sourceRedux, hasCostManagement(sourceRedux, appTypes)).then((source) => {
        if (source.source.imported) {
          redirectWhenImported(dispatch, intl, history, source.source.name);
        }

        setState({ type: 'setSource', source });
      });
    }
  }, [sourceRedux, isLoaded, appTypesLoaded]);

  useEffect(() => {
    if (source && appTypesLoaded && sourceTypesLoaded) {
      const sourceType = sourceTypes.find(({ id }) => id === source.source.source_type_id);

      setState({ type: 'createForm', sourceType, source, appTypes, intl });
    }
  }, [appTypesLoaded, source, sourceTypesLoaded]);

  const isLoading = !appTypesLoaded || !sourceTypesLoaded || loading;

  const returnToSources = () => history.push(routes.sources.path);

  if (isTimeouted) {
    return <TimeoutedModal />;
  }

  if (submitError) {
    return <ErroredModal onRetry={() => onSubmit(values, editing, dispatch, source, intl, setState)} />;
  }

  if (isSubmitting) {
    return <SubmittingModal />;
  }

  if (isLoading) {
    return (
      <Modal
        aria-label={intl.formatMessage({
          id: 'sources.editSource',
          defaultMessage: 'Edit source.',
        })}
        header={<Header />}
        isOpen
        variant="large"
        onClose={returnToSources}
      >
        <div className="ins-c-sources__dialog--spinnerContainer">
          <Spinner />
        </div>
      </Modal>
    );
  }

  return (
    <sourceEditContext.Provider value={{ setState, source, sourceType }}>
      {isAuthRemoving && <RemoveAuth authId={isAuthRemoving} />}
      <SourcesFormRenderer
        onCancel={returnToSources}
        schema={schema}
        onSubmit={(values, formApi) =>
          onSubmit(
            values,
            formApi.getState().dirtyFields,
            dispatch,
            source,
            intl,
            setState,
            hasCostManagement(sourceRedux, appTypes)
          )
        }
        FormTemplate={(props) => (
          <ModalFormTemplate
            ModalProps={{
              ['aria-label']: intl.formatMessage({
                id: 'sources.editSource',
                defaultMessage: 'Edit source.',
              }),
              header: <Header name={source.source.name} />,
              variant: 'large',
              isOpen: !isAuthRemoving,
              onClose: returnToSources,
            }}
            {...props}
          />
        )}
        clearedValue={null}
        initialValues={{
          ...initialValues,
          message,
        }}
      />
    </sourceEditContext.Provider>
  );
};

export default SourceEditModal;
