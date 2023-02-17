import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import {
  Alert,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from '@patternfly/react-core';

import get from 'lodash/get';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import ValuePopover from './ValuePopover';
import hardcodedSchemas from '../../components/addSourceWizard/hardcodedSchemas';
import { ACCOUNT_AUTHORIZATION } from '../constants';
import { CLOUD_METER_APP_NAME, COST_MANAGEMENT_APP_NAME } from '../../utilities/constants';
import { NO_APPLICATION_VALUE } from '../../components/addSourceWizard/stringConstants';
import {
  getAdditionalSteps,
  injectAuthFieldsInfo,
  injectEndpointFieldsInfo,
  shouldSkipEndpoint,
} from '../../components/addSourceWizard/schemaBuilder';
import { useFlag } from '@unleash/proxy-client-react';
import { labelMapper } from '../../utilities/labels';

const alertMapper = (appName, sourceType, intl) => {
  if (appName === COST_MANAGEMENT_APP_NAME && sourceType !== 'google') {
    return (
      <Alert
        variant="info"
        isInline
        title={intl.formatMessage({ id: 'cost.rbacWarningTitle', defaultMessage: 'Manage permissions in User Access' })}
      >
        {intl.formatMessage({
          id: 'cost.rbacWarningDescription',
          defaultMessage:
            'Make sure to manage permissions for this source in custom roles that contain permissions for Cost Management.',
        })}
      </Alert>
    );
  }

  if (appName === CLOUD_METER_APP_NAME && ['google'].includes(sourceType)) {
    return (
      <Alert
        variant="info"
        isInline
        title={intl.formatMessage({
          id: 'azure.rhelWarningTitle',
          defaultMessage: 'This source will not be monitored in Sources',
        })}
      >
        {intl.formatMessage({
          id: 'azure.rhelWarningDescription',
          defaultMessage: 'This source will be represented in the Sources list, but will not reflect true status or resources.',
        })}
      </Alert>
    );
  }

  return null;
};

export const createItem = (formField, values, stepKeys) => {
  let value = get(values, formField.name);

  if (formField.stepKey && !stepKeys.includes(formField.stepKey)) {
    return undefined;
  }

  if (formField.condition && get(values, formField.condition.when) !== formField.condition.is) {
    return undefined;
  }

  // do not show hidden fields
  if (formField.hideField) {
    return undefined;
  }

  // Hide password
  if (value && formField.type === 'password') {
    value = '●●●●●●●●●●●●';
  }

  // Boolean value convert to Yes / No
  if (typeof value === 'boolean') {
    value = value ? (
      <Label color="green">
        <FormattedMessage id="wizard.enabled" defaultMessage="Enabled" />
      </Label>
    ) : (
      <Label color="gray">
        <FormattedMessage id="wizard.disabled" defaultMessage="Disabled" />
      </Label>
    );
  }

  if (!value && formField.name === 'authentication.password' && get(values, 'authentication.id')) {
    value = '●●●●●●●●●●●●';
  }

  return { label: formField['aria-label'] || formField.label, value: value || '-' };
};

export const getAllFieldsValues = (fields, values, stepKeys) =>
  fields.map((field) => createItem(field, values, stepKeys)).filter(Boolean);

export const getStepKeys = (typeName, authName, appName = 'generic', appId) =>
  [
    ...get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'includeStepKeyFields'], []),
    ...get(hardcodedSchemas, [typeName, 'authentication', authName, appName, 'additionalSteps'], []).map(({ name }) => name),
    `${typeName}-${authName}-${appName}-additional-step`,
    `${typeName}-${authName}-additional-step`,
    appId ? `${typeName}-${appId}` : undefined,
  ].filter(Boolean);

const DesctiptionListItem = ({ term, description, ...props }) => (
  <DescriptionListGroup {...props}>
    <DescriptionListTerm>{term}</DescriptionListTerm>
    <DescriptionListDescription>{description}</DescriptionListDescription>
  </DescriptionListGroup>
);

DesctiptionListItem.propTypes = {
  term: PropTypes.node,
  description: PropTypes.node,
};

const SourceWizardSummary = ({ sourceTypes, applicationTypes, showApp, showAuthType }) => {
  const formOptions = useFormApi();
  const intl = useIntl();
  const enableLighthouse = useFlag('sources.wizard.lighthouse');

  const values = formOptions.getState().values;
  const type = sourceTypes.find((type) => type.name === values.source_type || type.id === values.source.source_type_id);

  const hasAuthentication =
    values.authentication && values.authentication.authtype ? values.authentication.authtype : values.auth_select;

  let authType;
  let authTypeFields = [];

  if (hasAuthentication) {
    authType = type.schema.authentication.find(({ type }) => type === hasAuthentication);
    authTypeFields = authType && authType.fields ? authType.fields : [];
  }

  let applicatioNames;

  if (values.source.app_creation_workflow === ACCOUNT_AUTHORIZATION) {
    applicatioNames = values.applications.map((app) =>
      labelMapper(
        applicationTypes.find((type) => type.id === app),
        intl
      )
    );
  }

  const application = values.application
    ? applicationTypes.find((type) => type.id === values.application.application_type_id)
    : undefined;

  const display_name =
    labelMapper(application, intl) || intl.formatMessage({ id: 'wizard.notSelected', defaultMessage: 'Not selected' });
  const { name, id } = application ? application : {};

  const skipEndpoint = shouldSkipEndpoint(type.name, hasAuthentication, name);

  let endpointFields = type.schema.endpoint?.fields || [];

  if (skipEndpoint) {
    endpointFields = [];
    authTypeFields = authTypeFields.filter(({ name }) => !name.includes('authentication.'));
  }

  const availableStepKeys = getStepKeys(type.name, hasAuthentication, name, id);

  const authSteps = getAdditionalSteps(type.name, hasAuthentication, name, enableLighthouse);
  const hasCustomSteps = get(hardcodedSchemas, [type.name, 'authentication', hasAuthentication, name, 'customSteps'], false);

  if (authSteps.length > 0) {
    authTypeFields = authSteps
      .map((step) => [...step.fields, ...authTypeFields.filter(({ stepKey }) => stepKey && step.name === stepKey)])
      .flatMap((x) => x)
      .filter(
        ({ name }) =>
          name.startsWith('application.extra') ||
          authTypeFields.find((field) => field.name === name) ||
          (hasCustomSteps && endpointFields.find((field) => field.name === name))
      );
  }

  if (hasCustomSteps) {
    endpointFields = [];
  }

  authTypeFields = injectAuthFieldsInfo(authTypeFields, type.name, hasAuthentication, name || 'generic');
  endpointFields = injectEndpointFieldsInfo(endpointFields, type.name);

  const fields = [...authTypeFields, ...endpointFields];

  const valuesInfo = getAllFieldsValues(fields, values, availableStepKeys);

  const valuesList = valuesInfo.map(({ label, value }) => (
    <DesctiptionListItem
      key={`${label}--${value}`}
      term={label}
      description={value.toString().length > 150 ? <ValuePopover label={label} value={value} /> : value}
    />
  ));
  return (
    <React.Fragment>
      <DescriptionList isHorizontal className="src-c-wizard__summary-description-list">
        <DesctiptionListItem
          term={intl.formatMessage({
            id: 'wizard.name',
            defaultMessage: 'Name',
          })}
          description={values.source.name}
        />
        <DesctiptionListItem
          term={intl.formatMessage({
            id: 'wizard.sourceType',
            defaultMessage: 'Source type',
          })}
          description={type.product_name}
        />
        {showApp && values.source.app_creation_workflow && (
          <DesctiptionListItem
            term={intl.formatMessage({
              id: 'wizard.configurationMode',
              defaultMessage: 'Configuration mode',
            })}
            description={
              values.source.app_creation_workflow === ACCOUNT_AUTHORIZATION
                ? intl.formatMessage({
                    id: 'wizard.accountAuth',
                    defaultMessage: 'Account authorization',
                  })
                : intl.formatMessage({
                    id: 'wizard.manualConfig',
                    defaultMessage: 'Manual configuration',
                  })
            }
          />
        )}
        {showApp && values.source.app_creation_workflow === ACCOUNT_AUTHORIZATION && (
          <DesctiptionListItem
            term={intl.formatMessage({
              id: 'wizard.applications',
              defaultMessage: 'Applications',
            })}
            description={
              applicatioNames.length
                ? applicatioNames.map((app) => <div key={app}>{app}</div>)
                : intl.formatMessage({ id: 'none', defaultMessage: 'None' })
            }
          />
        )}
        {showApp && values.source.app_creation_workflow !== ACCOUNT_AUTHORIZATION && (
          <DesctiptionListItem
            term={intl.formatMessage({
              id: 'wizard.application',
              defaultMessage: 'Application',
            })}
            description={display_name}
          />
        )}
        {showApp && values.source_type === 'oracle-cloud-infrastructure' && values.application?.extra?.bucket && (
          <DesctiptionListItem
            term={intl.formatMessage({
              id: 'wizard.bucket',
              defaultMessage: 'Bucket',
            })}
            description={values.application?.extra?.bucket}
          />
        )}
        {showApp && values.application?.extra?.bucket_namespace && (
          <DesctiptionListItem
            term={intl.formatMessage({
              id: 'wizard.bucket',
              defaultMessage: 'Bucket namespace',
            })}
            description={values.application?.extra?.bucket_namespace}
          />
        )}
        {showApp && values.application?.extra?.bucket_region && (
          <DesctiptionListItem
            term={intl.formatMessage({
              id: 'wizard.bucket',
              defaultMessage: 'Bucket region',
            })}
            description={values.application?.extra?.bucket_region}
          />
        )}
        {!skipEndpoint &&
          authType &&
          showAuthType &&
          values.source.app_creation_workflow !== ACCOUNT_AUTHORIZATION &&
          (!values.application?.application_type_id || values.application?.application_type_id === NO_APPLICATION_VALUE) && (
            <DesctiptionListItem
              term={intl.formatMessage({
                id: 'wizard.authenticationType',
                defaultMessage: 'Authentication type',
              })}
              description={authType.name}
            />
          )}
        {valuesList}
      </DescriptionList>
      {alertMapper(name, type.name, intl)}
    </React.Fragment>
  );
};

SourceWizardSummary.propTypes = {
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
  ).isRequired,
  applicationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      display_name: PropTypes.string.isRequired,
    })
  ).isRequired,
  showApp: PropTypes.bool,
  showAuthType: PropTypes.bool,
};

SourceWizardSummary.defaultProps = {
  showApp: true,
  showAuthType: true,
};

export default SourceWizardSummary;
