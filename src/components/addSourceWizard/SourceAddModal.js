import React, { useEffect, useRef } from 'react';
import { useQuery } from 'react-query';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { Wizard } from '@patternfly/react-core';

import createSchema from './SourceAddSchema';
import { APPLICATION_TYPES_KEY, SOURCE_TYPES_KEY } from '../../api/queryKeys';
import { doLoadApplicationTypes, doLoadSourceTypes } from '../../api/wizardHelpers';
import { wizardDescription, wizardTitle } from './stringConstants';
import filterApps, { filterVendorAppTypes } from '../../utilities/filterApps';
import filterTypes, { filterVendorTypes } from '../../utilities/filterTypes';
import Authentication from '../FormComponents/Authentication';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';
import LoadingStep from '../steps/LoadingStep';
import { useFlag } from '@unleash/proxy-client-react';

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

  let isSourceTypesLoading = false;
  let isAppTypesLoading = false;

  if (!sourceTypes) {
    ({
      data: sourceTypes,
      isLoading: isSourceTypesLoading,
      // isError: isSourceTypesError,
    } = useQuery(SOURCE_TYPES_KEY, doLoadSourceTypes));
  }

  if (!applicationTypes) {
    ({
      data: applicationTypes,
      isLoading: isAppTypesLoading,
      // isError: isAppTypesError,
    } = useQuery(APPLICATION_TYPES_KEY, doLoadApplicationTypes));
  }

  const container = useRef(document.createElement('div'));
  const intl = useIntl();

  useEffect(() => {
    container.current.style.opacity = isCancelling ? 0 : 1;
  }, [isCancelling]);

  if (isAppTypesLoading || isSourceTypesLoading) {
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

  // TODO: handle network errors

  return (
    <SourcesFormRenderer
      initialValues={{
        ...values,
        ...(selectedType && { source_type: selectedType }),
      }}
      schema={createSchema(
        sourceTypes.filter(filterTypes).filter(filterVendorTypes(activeCategory)),
        applicationTypes.filter(filterApps).filter(filterVendorAppTypes(sourceTypes, activeCategory)),
        disableAppSelection,
        container.current,
        intl,
        selectedType,
        initialWizardState,
        activeCategory,
        enableLighthouse
      )}
      onSubmit={(values, _formApi, wizardState) => onSubmit(values, sourceTypes, wizardState, applicationTypes)}
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
