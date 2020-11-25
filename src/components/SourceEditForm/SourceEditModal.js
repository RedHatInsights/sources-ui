import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';

import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import { onSubmit } from './onSubmit';

import { redirectWhenImported } from './importedRedirect';
import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import reducer, { initialState } from './reducer';
import SubmittingModal from './SubmittingModal';
import TimeoutedModal from './TimeoutedModal';
import ErroredModal from './ErroredModal';
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

  if (isTimeouted) {
    return <TimeoutedModal setState={setState} />;
  }

  if (submitError) {
    return (
      <ErroredModal
        onRetry={() => onSubmit(values, editing, dispatch, source, intl, setState, hasCostManagement(sourceRedux, appTypes))}
      />
    );
  }

  if (isSubmitting) {
    return <SubmittingModal />;
  }

  if (isLoading) {
    return (
      <Bullseye className="pf-u-m-2xl">
        <Spinner />
      </Bullseye>
    );
  }

  return (
    <SourcesFormRenderer
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
        <FormTemplate canReset submitLabel="Save changes" disableSubmit={['pristine', 'invalid']} {...props} />
      )}
      clearedValue={null}
      initialValues={{
        ...initialValues,
        message,
      }}
    />
  );
};

export default SourceEditModal;
