import React, { useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import isEmpty from 'lodash/isEmpty';
import { FormattedMessage } from 'react-intl';

import { Button } from '@patternfly/react-core';

import Form from './SourceAddModal';
import FinalWizard from './FinalWizard';

import { wizardTitle } from './stringConstants';

import isSuperKey from '../../utilities/isSuperKey';
import { CLOUD_VENDOR, REDHAT_VENDOR, timeoutedApps } from '../../utilities/constants';
import createSuperSource from '../../api/createSuperSource';
import { doCreateSource } from '../../api/createSource';
import CloseModal from '../CloseModal';

const prepareInitialValues = (initialValues, activeCategory) => ({
  isSubmitted: false,
  isFinished: false,
  isErrored: false,
  isCancelling: false,
  values: initialValues,
  createdSource: {},
  error: undefined,
  activeCategory,
});

const reducer = (state, { type, values, data, error, initialValues, sourceTypes, applicationTypes }) => {
  switch (type) {
    case 'reset':
      return prepareInitialValues(initialValues, state.activeCategory);
    case 'prepareSubmitState':
      return {
        ...state,
        isFinished: false,
        isErrored: false,
        error: undefined,
        isSubmitted: true,
        values,
        sourceTypes,
        applicationTypes,
      };
    case 'setSubmitted':
      return { ...state, isFinished: true, createdSource: data };
    case 'setErrored':
      return { ...state, isErrored: true, error: error.toString() };
    case 'onStay':
      return { ...state, isCancelling: false };
    case 'showCancelModal':
      return { ...state, isCancelling: true, values };
  }
};

const AddSourceWizard = ({
  successfulMessage,
  isOpen,
  sourceTypes,
  applicationTypes,
  disableAppSelection,
  hideSourcesButton,
  returnButtonTitle,
  initialValues,
  onClose,
  afterSuccess,
  selectedType,
  initialWizardState,
  submitCallback,
  activeCategory: propsActiveCategory,
}) => {
  const [{ isErrored, isFinished, isSubmitted, values, error, isCancelling, createdSource, activeCategory, ...state }, dispatch] =
    useReducer(reducer, prepareInitialValues(initialValues, propsActiveCategory));

  const onSubmit = (formValues, sourceTypes, wizardState, applicationTypes) => {
    dispatch({ type: 'prepareSubmitState', values: formValues, sourceTypes, applicationTypes });

    const fn = isSuperKey(formValues.source) ? createSuperSource : doCreateSource;

    return fn(formValues, timeoutedApps(applicationTypes), applicationTypes)
      .then((data) => {
        afterSuccess && afterSuccess(data);
        submitCallback && submitCallback({ isSubmitted: true, createdSource: data, sourceTypes });
        dispatch({ type: 'setSubmitted', data });
      })
      .catch((error) => {
        submitCallback && submitCallback({ isErrored: true, error, values: formValues, sourceTypes, wizardState });
        dispatch({ type: 'setErrored', error });
      });
  };

  const reset = () => dispatch({ type: 'reset', initialValues });

  const afterSubmit = () => {
    onClose(undefined, createdSource);
    reset();
  };

  const onCancelBeforeExit = (values) => (isEmpty(values) ? onClose({}) : dispatch({ type: 'showCancelModal', values }));

  const onExit = () => onClose(values);

  if (!isOpen) {
    return null;
  }

  if (!isSubmitted) {
    return (
      <React.Fragment>
        {isCancelling && <CloseModal onExit={onExit} onStay={() => dispatch({ type: 'onStay' })} />}
        <Form
          isCancelling={isCancelling}
          values={values}
          onSubmit={onSubmit}
          onCancel={onCancelBeforeExit}
          sourceTypes={sourceTypes}
          applicationTypes={applicationTypes}
          disableAppSelection={disableAppSelection}
          selectedType={selectedType}
          initialWizardState={initialWizardState}
          activeCategory={activeCategory}
        />
      </React.Fragment>
    );
  }

  return (
    <FinalWizard
      afterSubmit={afterSubmit}
      afterError={() => onClose({})}
      isFinished={isFinished}
      isErrored={isErrored}
      successfulMessage={successfulMessage}
      hideSourcesButton={hideSourcesButton}
      returnButtonTitle={returnButtonTitle}
      errorMessage={error}
      reset={reset}
      createdSource={createdSource}
      tryAgain={() => onSubmit(values, state.sourceTypes, undefined, state.applicationTypes)}
      afterSuccess={afterSuccess}
      sourceTypes={state.sourceTypes}
      activeCategory={activeCategory}
    />
  );
};

AddSourceWizard.propTypes = {
  afterSuccess: PropTypes.func,
  sourceTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      product_name: PropTypes.string.isRequired,
      schema: PropTypes.shape({
        authentication: PropTypes.array,
        endpoint: PropTypes.object,
      }),
    })
  ),
  applicationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      display_name: PropTypes.string.isRequired,
    })
  ),
  onClose: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  successfulMessage: PropTypes.node,
  initialValues: PropTypes.shape({
    [PropTypes.string]: PropTypes.oneOf([PropTypes.string, PropTypes.array, PropTypes.number, PropTypes.bool]),
  }),
  disableAppSelection: PropTypes.bool,
  hideSourcesButton: PropTypes.bool,
  returnButtonTitle: PropTypes.node,
  selectedType: PropTypes.string,
  initialWizardState: PropTypes.object,
  submitCallback: PropTypes.func,
  activeCategory: PropTypes.oneOf([REDHAT_VENDOR, CLOUD_VENDOR]),
};

AddSourceWizard.defaultProps = {
  successfulMessage: <FormattedMessage id="wizard.successfulMessage" defaultMessage="Your source was successfully added." />,
  initialValues: {},
  returnButtonTitle: <FormattedMessage id="wizard.goBackToSources" defaultMessage="Go back to Sources" />,
};

export const AddSourceButton = (props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <React.Fragment>
      <Button variant="primary" onClick={() => setIsOpen(true)}>
        {wizardTitle()}
      </Button>
      <AddSourceWizard isOpen={isOpen} onClose={() => setIsOpen(false)} {...props} />
    </React.Fragment>
  );
};

export default AddSourceWizard;
