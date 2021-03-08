import React, { useRef, useEffect, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';

import { Wizard } from '@patternfly/react-core/dist/esm/components/Wizard/Wizard';

import createSchema from './SourceAddSchema';
import { doLoadSourceTypes, doLoadApplicationTypes } from '../../api/wizardHelpers';
import { wizardDescription, wizardTitle } from '../utilities/stringConstants';
import filterApps, { filterVendorAppTypes } from '../../utilities/filterApps';
import filterTypes, { filterVendorTypes } from '../../utilities/filterTypes';
import Authentication from '../../components/FormComponents/Authentication';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import LoadingStep from '../../components/steps/LoadingStep';

const initialValues = {
  schema: {},
  sourceTypes: [],
  isLoading: true,
};

const reducer = (
  state,
  { type, sourceTypes, applicationTypes, container, disableAppSelection, intl, selectedType, initialWizardState }
) => {
  switch (type) {
    case 'loaded':
      return {
        ...state,
        schema: createSchema(
          sourceTypes.filter(filterTypes).filter(filterVendorTypes),
          applicationTypes.filter(filterApps).filter(filterVendorAppTypes(sourceTypes)),
          disableAppSelection,
          container,
          intl,
          selectedType,
          initialWizardState
        ),
        isLoading: false,
        sourceTypes,
      };
  }
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
}) => {
  const [{ schema, sourceTypes: stateSourceTypes, isLoading }, dispatch] = useReducer(reducer, initialValues);
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
          disableAppSelection,
          container: container.current,
          intl,
          selectedType,
          initialWizardState,
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
        title={wizardTitle()}
        description={wizardDescription()}
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
      onSubmit={(values, _formApi, wizardState) => onSubmit(values, stateSourceTypes, wizardState)}
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
};

SourceAddModal.defaultProps = {
  values: {},
  disableAppSelection: false,
};

export default SourceAddModal;
