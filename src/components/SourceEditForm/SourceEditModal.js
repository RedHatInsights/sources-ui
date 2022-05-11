import React, { useEffect, useReducer } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useIntl } from 'react-intl';
import { Spinner, Bullseye } from '@patternfly/react-core';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';
import { onSubmit } from './onSubmit';

import { useSource } from '../../hooks/useSource';
import { useIsLoaded } from '../../hooks/useIsLoaded';
import reducer, { initialState } from './reducer';
import SubmittingModal from './SubmittingModal';
import ErroredModal from './ErroredModal';
import { prepareMessages } from './helpers';

const SourceEditModal = () => {
  const [state, setState] = useReducer(reducer, initialState);
  const sourceRedux = useSource();
  const isLoaded = useIsLoaded();

  const { loading, editing, source, initialValues, schema, isSubmitting, initialLoad, message, messages, submitError, values } =
    state;

  const intl = useIntl();

  const { sourceTypes, appTypes, sourceTypesLoaded, appTypesLoaded } = useSelector(({ sources }) => sources, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!initialLoad) {
      setState({ type: 'sourceChanged' });
    }
  }, [sourceRedux, sourceRedux?.applications?.length]);

  useEffect(() => {
    if (sourceRedux && initialLoad && appTypesLoaded) {
      doLoadSourceForEdit(sourceRedux).then((source) => {
        const messages = prepareMessages(source, intl, appTypes);

        setState({ type: 'setSource', source, messages });
      });
    }
  }, [sourceRedux, isLoaded, appTypesLoaded, initialLoad]);

  useEffect(() => {
    if (source && appTypesLoaded && sourceTypesLoaded) {
      const sourceType = sourceTypes.find(({ id }) => id === source.source.source_type_id);

      setState({ type: 'createForm', sourceType, source, appTypes, intl });
    }
  }, [appTypesLoaded, source, sourceTypesLoaded]);

  const isLoading = !appTypesLoaded || !sourceTypesLoaded || loading;

  if (submitError) {
    return <ErroredModal onRetry={() => onSubmit(values, editing, dispatch, source, intl, setState)} />;
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

  const hideFormControls = source.source.paused_at || source.applications.every(({ paused_at }) => paused_at);

  return (
    <SourcesFormRenderer
      schema={schema}
      onSubmit={(values, formApi) => onSubmit(values, formApi.getState().dirtyFields, dispatch, source, intl, setState)}
      FormTemplate={(props) => (
        <FormTemplate
          canReset
          showFormControls={!hideFormControls}
          submitLabel="Save changes"
          disableSubmit={['pristine', 'invalid']}
          {...props}
        />
      )}
      clearedValue={null}
      initialValues={{
        ...initialValues,
        ...(!sourceRedux.paused_at && { message }),
        ...(!sourceRedux.paused_at && { messages }),
      }}
    />
  );
};

export default SourceEditModal;
