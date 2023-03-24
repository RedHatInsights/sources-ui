import React, { useEffect, useReducer, useRef } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { Wizard } from '@patternfly/react-core';

import createSchema from './SourceAddSchema';
import { doLoadApplicationTypes, doLoadSourceTypes } from '../../api/wizardHelpers';
import { wizardDescription, wizardTitle } from './stringConstants';
import filterApps, { filterVendorAppTypes } from '../../utilities/filterApps';
import filterTypes, { filterVendorTypes } from '../../utilities/filterTypes';
import Authentication from '../FormComponents/Authentication';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import LoadingStep from '../steps/LoadingStep';
import { useFlag } from '@unleash/proxy-client-react';

const initialValues = {
  schema: {},
  sourceTypes: [],
  isLoading: true,
};

const FormTemplateWrapper = (props) => <FormTemplate {...props} showFormControls={false} />;

const SourceAddModal = ({
  sourceTypes,
  applicationTypes,
  disableAppSelection,
  isCancelling,
  onCancel,
  values,
  onSubmit,
  selectedType,
  initialWizardState,
  activeCategory,
}) => {
  const enableLighthouse = useFlag('sources.wizard.lighthouse');

  const reducer = (
    state,
    {
      type,
      sourceTypes,
      applicationTypes,
      container,
      disableAppSelection,
      intl,
      selectedType,
      initialWizardState,
      activeCategory,
      hcsEnrolled,
    }
  ) => {
    switch (type) {
      case 'loaded':
        return {
          ...state,
          schema: createSchema(
            sourceTypes.filter(filterTypes).filter(filterVendorTypes(activeCategory)),
            applicationTypes.filter(filterApps).filter(filterVendorAppTypes(sourceTypes, activeCategory)),
            disableAppSelection,
            container,
            intl,
            selectedType,
            initialWizardState,
            activeCategory,
            enableLighthouse,
            hcsEnrolled
          ),
          isLoading: false,
          sourceTypes,
          applicationTypes,
          hcsEnrolled,
        };
    }
  };

  const [{ schema, sourceTypes: stateSourceTypes, applicationTypes: stateApplicationTypes, isLoading }, dispatch] = useReducer(
    reducer,
    initialValues
  );
  const hcsEnrolled = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);
  const isMounted = useRef(false);
  const container = useRef(document.createElement('div'));
  const intl = useIntl();

  useEffect(() => {
    isMounted.current = true;

    const promises = [];
    if (!sourceTypes) {
      promises.push(doLoadSourceTypes());
    }

    if (!applicationTypes) {
      promises.push(doLoadApplicationTypes());
    }

    Promise.all(promises).then((data) => {
      const sourceTypesOut = data.find((types) => Object.prototype.hasOwnProperty.call(types, 'sourceTypes'));
      const applicationTypesOut = data.find((types) => Object.prototype.hasOwnProperty.call(types, 'applicationTypes'));

      if (isMounted.current) {
        dispatch({
          type: 'loaded',
          sourceTypes: sourceTypes || sourceTypesOut.sourceTypes,
          applicationTypes: applicationTypes || applicationTypesOut.applicationTypes,
          hcsEnrolled,
          disableAppSelection,
          container: container.current,
          intl,
          selectedType,
          initialWizardState,
          activeCategory,
        });
      }
    });

    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    container.current.style.opacity = isCancelling ? 0 : 1;
  }, [isCancelling]);

  if (isLoading) {
    return (
      <Wizard
        className="sources"
        isOpen={true}
        onClose={onCancel}
        title={wizardTitle(activeCategory)}
        description={wizardDescription(activeCategory)}
        steps={[
          {
            name: 'Loading',
            component: <LoadingStep onClose={() => onCancel()} />,
            isFinishedStep: true,
          },
        ]}
      />
    );
  }

  return (
    <SourcesFormRenderer
      initialValues={{
        ...values,
        ...(selectedType && { source_type: selectedType }),
      }}
      schema={schema}
      onSubmit={(values, _formApi, wizardState) =>
        onSubmit(values, stateSourceTypes, wizardState, stateApplicationTypes, hcsEnrolled)
      }
      onCancel={onCancel}
      FormTemplate={FormTemplateWrapper}
      subscription={{ values: true }}
      componentMapper={{
        authentication: Authentication,
      }}
    />
  );
};

SourceAddModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
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
  values: PropTypes.object,
  disableAppSelection: PropTypes.bool,
  isCancelling: PropTypes.bool,
  selectedType: PropTypes.string,
  initialWizardState: PropTypes.object,
  activeCategory: PropTypes.string,
};

SourceAddModal.defaultProps = {
  values: {},
  disableAppSelection: false,
};

export default SourceAddModal;
