import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';

import { Content, ContentVariants } from '@patternfly/react-core';

import debouncePromise from '../../utilities/debouncePromise';
import { findSource } from '../../api/wizardHelpers';
import { schemaBuilder } from './schemaBuilder';
import { NO_APPLICATION_VALUE, wizardDescription, wizardTitle } from './stringConstants';
import configurationStep from './superKey/configurationStep';
import { compileAllApplicationComboOptions } from './compileAllApplicationComboOptions';
import applicationsStep from './superKey/applicationsStep';
import { REDHAT_VENDOR } from '../../utilities/constants';
import validated from '../../utilities/resolveProps/validated';
import handleError from '../../api/handleError';
import { bold } from '../../utilities/intlShared';

export const asyncValidator = async (value, sourceId = undefined, intl) => {
  if (!value) {
    return undefined;
  }

  let response;
  try {
    response = await findSource(value);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error(handleError(error));
    return undefined;
  }

  if (response.data.sources.find(({ id }) => id !== sourceId)) {
    throw intl.formatMessage({ defaultMessage: 'That name is taken. Try another.', id: 'wizard.nameTaken' });
  }

  return undefined;
};

let firstValidation = true;
export const setFirstValidated = (bool) => (firstValidation = bool);
export const getFirstValidated = () => firstValidation;

export const asyncValidatorDebounced = debouncePromise(asyncValidator);

export const asyncValidatorDebouncedWrapper = (intl) => {
  if (getFirstValidated()) {
    setFirstValidated(false);
    return (value, id) => (value ? asyncValidator(value, id, intl) : undefined);
  }

  return asyncValidatorDebounced;
};

export const compileAllSourcesComboOptions = (sourceTypes) => [
  ...sourceTypes
    .map((type) => ({
      ...type,
      product_name: type.category === 'Red Hat' ? type.product_name.replace('Red Hat ', '') : type.product_name,
    }))
    .sort((a, b) => a.product_name.localeCompare(b.product_name))
    .map((t) => ({
      value: t.name,
      label: t.product_name,
    })),
];

export const appMutatorRedHat = (appTypes) => (option, formOptions) => {
  const selectedSourceType = formOptions.getState().values.source_type;
  const appType = appTypes.find((app) => app.id === option.value);
  const isEnabled = selectedSourceType && appType ? appType.supported_source_types.includes(selectedSourceType) : true;

  if (!isEnabled) {
    return;
  }

  return option;
};

const shortIcons = {
  amazon: '/apps/frontend-assets/partners-icons/aws-logomark.svg',
  'ansible-tower': '/apps/frontend-assets/red-hat-logos/stacked.svg',
  azure: '/apps/frontend-assets/partners-icons/microsoft-azure-logomark.svg',
  openshift: '/apps/frontend-assets/red-hat-logos/stacked.svg',
  satellite: '/apps/frontend-assets/red-hat-logos/stacked.svg',
  google: '/apps/frontend-assets/partners-icons/google-cloud-logomark.svg',
};

// eslint-disable-next-line react/display-name
export const iconMapper = (sourceTypes) => (name) => {
  const sourceType = sourceTypes.find((type) => type.name === name);

  if (!sourceType || (!sourceType.icon_url && !shortIcons[name])) {
    return null;
  }

  const Icon = () => (
    <img
      src={shortIcons[name] || sourceType.icon_url}
      alt={sourceType.product_name}
      className={`src-c-wizard__icon pf-v6-u-display-block ${sourceType.category === 'Red Hat' ? 'redhat-icon' : 'pf-v6-u-mb-sm'}`}
      width="40"
      height="40"
    />
  );

  return Icon;
};

export const nextStep =
  (selectedType) =>
  ({ values: { application, source_type } }) => {
    if (selectedType) {
      return 'application_step';
    }

    const appId = application && application.application_type_id !== NO_APPLICATION_VALUE && application.application_type_id;
    const resultedStep = appId ? `${source_type}-${appId}` : `${source_type}-generic`;

    return resultedStep;
  };

export const hasSuperKeyType = (sourceType) => sourceType?.schema.authentication.find(({ is_superkey }) => is_superkey);

export const nextStepCloud =
  (sourceTypes) =>
  ({ values }) => {
    const sourceType = sourceTypes.find(({ name }) => name === values.source_type);

    return hasSuperKeyType(sourceType) ? 'configuration_step' : 'application_step';
  };

const sourceTypeSelect = ({ intl, sourceTypes, applicationTypes }) => ({
  component: 'card-select',
  name: 'source_type',
  isRequired: true,
  label: intl.formatMessage({
    id: 'wizard.selectYourSourceType',
    defaultMessage: 'A. Select your integration type',
  }),
  iconMapper: iconMapper(sourceTypes),
  validate: [
    {
      type: validatorTypes.REQUIRED,
    },
  ],
  options: compileAllSourcesComboOptions(sourceTypes, applicationTypes),
});

const redhatTypes = ({ intl, sourceTypes, applicationTypes, disableAppSelection }) => [
  sourceTypeSelect({ intl, sourceTypes, applicationTypes }),
  {
    component: 'enhanced-radio',
    name: 'application.application_type_id',
    label: intl.formatMessage({
      id: 'wizard.selectApplication',
      defaultMessage: 'B. Application',
    }),
    options: compileAllApplicationComboOptions(applicationTypes, intl, REDHAT_VENDOR),
    mutator: appMutatorRedHat(applicationTypes),
    isDisabled: disableAppSelection,
    isRequired: true,
    validate: [{ type: validatorTypes.REQUIRED }],
    condition: { when: 'source_type', isNotEmpty: true },
  },
];

// Custom validator to ensure a real application is selected (not NO_APPLICATION_VALUE)
const validateApplicationSelection = (intl) => (value) => {
  if (!value || value === NO_APPLICATION_VALUE) {
    return intl.formatMessage({
      id: 'wizard.applicationRequired',
      defaultMessage: 'An application must be selected.',
    });
  }

  return undefined;
};

export const applicationStep = (applicationTypes, intl, activeCategory, hcsEnrolled) => ({
  name: 'application_step',
  title: intl.formatMessage({
    id: 'wizard.selectApplication',
    defaultMessage: 'Select application',
  }),
  nextStep: nextStep(),
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'app-description',
      label: intl.formatMessage(
        {
          id: 'wizard.applicationDescription',
          defaultMessage:
            'Select an application to connect to your integration. You can connect additional applications after integration creation. {learnMore}',
        },
        {
          learnMore: (
            <Content
              key="link"
              rel="noopener noreferrer"
              target="_blank"
              component={ContentVariants.a}
              href="https://docs.redhat.com/en/documentation/red_hat_hybrid_cloud_console/1-latest/html/configuring_cloud_integrations_for_red_hat_services/assembly-adding-cloud-integrations_crc-cloud-integrations#adding-azure-integration_assembly-adding-cloud-integrations"
            >
              {intl.formatMessage({
                id: 'wizard.learnMore defaultMessage=Learn more',
                defaultMessage: 'Learn more',
              })}
            </Content>
          ),
        },
      ),
    },
    {
      component: 'enhanced-radio',
      name: 'application.application_type_id',
      label: intl.formatMessage({
        id: 'wizard.selectApplicationType',
        defaultMessage: 'Select an application',
      }),
      options: compileAllApplicationComboOptions(applicationTypes, intl, hcsEnrolled),
      mutator: appMutatorRedHat(applicationTypes),
      menuIsPortal: true,
      isRequired: true,
      validate: [validateApplicationSelection(intl)],
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'source_type',
      hideField: true,
    },
  ],
});

export const typesStep = (sourceTypes, applicationTypes, disableAppSelection, intl) => ({
  title: intl.formatMessage({
    id: 'wizard.chooseAppAndType',
    defaultMessage: 'Integration type and application',
  }),
  name: 'types_step',
  nextStep: 'name_step',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label: intl.formatMessage({
        id: 'wizard.selectRedHatType',
        defaultMessage:
          'To import data for an application, you need to configure an integration. Start by selecting your cloud provider and application.',
      }),
    },
    ...redhatTypes({ intl, sourceTypes, applicationTypes, disableAppSelection }),
  ],
});

export const cloudTypesStep = (sourceTypes, applicationTypes, intl) => ({
  title: intl.formatMessage({
    id: 'wizard.chooseAppAndType',
    defaultMessage: 'Select cloud provider',
  }),
  name: 'types_step',
  nextStep: 'name_step',
  fields: [
    {
      component: componentTypes.PLAIN_TEXT,
      name: 'plain-text',
      label: intl.formatMessage({
        id: 'wizard.selectCloudType',
        defaultMessage:
          'To import data for an application, you need to configure an integration. Start by selecting your cloud provider.',
      }),
    },
    {
      ...sourceTypeSelect({ intl, sourceTypes, applicationTypes }),
      label: intl.formatMessage({
        id: 'wizard.selectCloudProvider',
        defaultMessage: 'Select a cloud provider',
      }),
    },
  ],
});

export const NameDescription = ({ sourceTypes }) => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const typeName = sourceTypes.find(({ name }) => name === getState().values.source_type)?.product_name;

  return (
    <Content key="step1" component={ContentVariants.p}>
      {intl.formatMessage(
        {
          id: 'wizard.nameDescription',
          defaultMessage: 'Enter a name for your {typeName} integration.',
        },
        { typeName },
      )}
    </Content>
  );
};

NameDescription.propTypes = {
  sourceTypes: PropTypes.array,
};

const nameStep = (intl, selectedType, sourceTypes, activeCategory) => ({
  title: intl.formatMessage({
    id: 'wizard.nameSource',
    defaultMessage: 'Name integration',
  }),
  name: 'name_step',
  nextStep: activeCategory === REDHAT_VENDOR ? nextStep(selectedType) : nextStepCloud(sourceTypes),
  fields: [
    {
      component: 'description',
      name: 'description-summary',
      Content: NameDescription,
      sourceTypes,
    },
    {
      component: componentTypes.TEXT_FIELD,
      name: 'source.name',
      type: 'text',
      label: intl.formatMessage({
        id: 'wizard.name',
        defaultMessage: 'Integration name',
      }),
      placeholder: 'integration_name',
      isRequired: true,
      validate: [(value) => asyncValidatorDebouncedWrapper(intl)(value, undefined, intl), { type: validatorTypes.REQUIRED }],
      resolveProps: validated,
    },
  ],
});

export const SummaryDescription = () => {
  const intl = useIntl();

  return (
    <Content component={ContentVariants.p}>
      {intl.formatMessage(
        {
          id: 'wizard.summaryDescription',
          defaultMessage:
            'Review the information below and click <b>Add</b> to add your integration. To edit details in previous steps, click <b>Back</b>.',
        },
        {
          b: bold,
        },
      )}
    </Content>
  );
};

const summaryStep = (sourceTypes, applicationTypes, intl) => ({
  fields: [
    {
      component: 'description',
      name: 'description-summary',
      Content: SummaryDescription,
    },
    {
      name: 'summary',
      component: 'summary',
      sourceTypes,
      applicationTypes,
    },
    {
      name: 'source_type',
      component: componentTypes.TEXT_FIELD,
      hideField: true,
    },
  ],
  name: 'summary',
  title: intl.formatMessage({
    id: 'wizard.reviewDetails',
    defaultMessage: 'Review details',
  }),
});

export default (
  sourceTypes,
  applicationTypes,
  disableAppSelection,
  container,
  intl,
  selectedType,
  initialWizardState,
  activeCategory,
  enableLighthouse,
  hcsEnrolled,
) => {
  setFirstValidated(true);
  return {
    fields: [
      {
        component: componentTypes.WIZARD,
        name: 'wizard',
        className: 'sources',
        title: wizardTitle(activeCategory),
        inModal: true,
        description: wizardDescription(activeCategory),
        buttonLabels: {
          submit: intl.formatMessage({
            id: 'sources.add',
            defaultMessage: 'Add',
          }),
          back: intl.formatMessage({
            id: 'wizard.back',
            defaultMessage: 'Back',
          }),
          cancel: intl.formatMessage({
            id: 'wizard.cancel',
            defaultMessage: 'Cancel',
          }),
          next: intl.formatMessage({
            id: 'wizard.next',
            defaultMessage: 'Next',
          }),
        },
        container,
        showTitles: true,
        initialState: initialWizardState,
        closeButtonAriaLabel: intl.formatMessage({
          id: 'wizard.close',
          defaultMessage: 'Close wizard',
        }),
        crossroads: [
          'application.application_type_id',
          'source_type',
          'auth_select',
          'source.app_creation_workflow',
          'application.extra.storage_only',
        ],
        fields: [
          ...(!selectedType
            ? activeCategory === REDHAT_VENDOR
              ? [typesStep(sourceTypes, applicationTypes, disableAppSelection, intl)]
              : [cloudTypesStep(sourceTypes, applicationTypes, intl)]
            : []),
          nameStep(intl, selectedType, sourceTypes, activeCategory),
          configurationStep(intl, sourceTypes),
          applicationsStep(applicationTypes, intl, hcsEnrolled),
          applicationStep(applicationTypes, intl, activeCategory, hcsEnrolled),
          ...schemaBuilder(sourceTypes, applicationTypes, undefined, enableLighthouse, hcsEnrolled),
          summaryStep(sourceTypes, applicationTypes, intl),
        ],
      },
    ],
  };
};
