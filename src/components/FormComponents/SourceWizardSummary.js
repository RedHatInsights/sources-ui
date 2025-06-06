import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { shallowEqual, useSelector } from 'react-redux';
import get from 'lodash/get';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Alert,
  Content,
  ContentVariants,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  Label,
} from '@patternfly/react-core';
import { useFlag } from '@unleash/proxy-client-react';

import ValuePopover from './ValuePopover';
import hardcodedSchemas from '../../components/addSourceWizard/hardcodedSchemas';
import { ACCOUNT_AUTHORIZATION } from '../constants';
import { CLOUD_METER_APP_NAME, COST_MANAGEMENT_APP_ID, COST_MANAGEMENT_APP_NAME, HCS_APP_NAME } from '../../utilities/constants';
import { MANUAL_CUR_STEPS as CUR_AWS } from '../addSourceWizard/hardcodedComponents/aws/arn';
import { MANUAL_CUR_STEPS as CUR_AZURE } from '../addSourceWizard/hardcodedComponents/azure/costManagement';
import { MANUAL_CUR_STEPS as CUR_GCP } from '../addSourceWizard/hardcodedComponents/gcp/costManagement';
import { NO_APPLICATION_VALUE } from '../../components/addSourceWizard/stringConstants';
import {
  getAdditionalSteps,
  injectAuthFieldsInfo,
  injectEndpointFieldsInfo,
  shouldSkipEndpoint,
} from '../../components/addSourceWizard/schemaBuilder';

const linkMapper = (sourceType) => ({ amazon: CUR_AWS, azure: CUR_AZURE, google: CUR_GCP })?.[sourceType];

const SummaryAlert = ({ scope, sourceType, hcsEnrolled }) => {
  const intl = useIntl();
  const formOptions = useFormApi();
  const sourceTypes = useSelector(({ sources }) => sources.sourceTypes, shallowEqual);

  const storageOnly = formOptions.getState().values.application?.extra?.storage_only;
  const application = sourceTypes.find((type) => type.name === sourceType)?.product_name;

  if (scope === COST_MANAGEMENT_APP_NAME) {
    return (
      <Fragment>
        {['azure', 'amazon', 'google'].includes(sourceType) && storageOnly ? (
          <Alert
            variant="info"
            isInline
            title={intl.formatMessage({
              id: 'cost.warningTitleCUR',
              defaultMessage: "Don't forget additional configuration steps!",
            })}
            actionLinks={
              <Content component={ContentVariants.a} href={linkMapper(sourceType)}>
                {intl.formatMessage(
                  {
                    id: 'cost.customizingReportCUR',
                    defaultMessage: 'Customizing your {application} cost and usage report',
                  },
                  { application },
                )}
              </Content>
            }
          >
            {intl.formatMessage({
              id: 'cost.warningDescriptionCUR',
              defaultMessage:
                'You will need to perform more configuration steps after creating the source. To find more information, click on the link below.',
            })}
          </Alert>
        ) : null}
        {hcsEnrolled ? null : (
          <Alert
            variant="default"
            isInline
            title={intl.formatMessage({ id: 'cost.rbacWarningTitle', defaultMessage: 'Manage permissions in User Access' })}
          >
            {intl.formatMessage({
              id: 'cost.rbacWarningDescription',
              defaultMessage:
                'Make sure to manage permissions for this integration in custom roles that contain permissions for Cost Management.',
            })}
          </Alert>
        )}
      </Fragment>
    );
  }

  if (scope === CLOUD_METER_APP_NAME && ['google'].includes(sourceType)) {
    return (
      <Alert
        variant="info"
        isInline
        title={intl.formatMessage({
          id: 'azure.rhelWarningTitle',
          defaultMessage: 'This integration will not be monitored in Integrations',
        })}
      >
        {intl.formatMessage({
          id: 'azure.rhelWarningDescription',
          defaultMessage:
            'This integration will be represented in the Integrations list, but will not reflect true status or resources.',
        })}
      </Alert>
    );
  }

  return null;
};

SummaryAlert.propTypes = {
  scope: PropTypes.string,
  sourceType: PropTypes.string,
  hcsEnrolled: PropTypes.bool,
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

  // do not show fields hidden just for review step
  if (formField.hideInReview) {
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

export const getStepKeys = (typeName, authName, scope = 'generic', appId) =>
  [
    ...get(hardcodedSchemas, [typeName, 'authentication', authName, scope, 'includeStepKeyFields'], []),
    ...get(hardcodedSchemas, [typeName, 'authentication', authName, scope, 'additionalSteps'], []).map(({ name }) => name),
    `${typeName}-${authName}-${scope}-additional-step`,
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
  const hcsEnrolled = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);

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
    applicatioNames = values.applications.map(
      (app) =>
        app === COST_MANAGEMENT_APP_ID && hcsEnrolled
          ? HCS_APP_NAME
          : applicationTypes.find((type) => type.id === app)?.display_name, // overwrite Cost management for AWS with HCS for account auth.
    );
  }

  const application = values.application
    ? applicationTypes.find((type) => type.id === values.application.application_type_id)
    : undefined;

  const {
    display_name = intl.formatMessage({ id: 'wizard.notSelected', defaultMessage: 'Not selected' }),
    name,
    id,
  } = application ? application : {};

  const skipEndpoint = shouldSkipEndpoint(type.name, hasAuthentication, name);

  let endpointFields = type.schema.endpoint?.fields || [];

  if (skipEndpoint) {
    endpointFields = [];
    authTypeFields = authTypeFields.filter(({ name }) => !name.includes('authentication.'));
  }

  const availableStepKeys = getStepKeys(type.name, hasAuthentication, name, id);

  const authSteps = getAdditionalSteps(type.name, hasAuthentication, name, enableLighthouse, hcsEnrolled);
  const hasCustomSteps = get(hardcodedSchemas, [type.name, 'authentication', hasAuthentication, name, 'customSteps'], false);

  if (authSteps.length > 0) {
    authTypeFields = authSteps
      .map((step) => [...step.fields, ...authTypeFields.filter(({ stepKey }) => stepKey && step.name === stepKey)])
      .flatMap((x) => x)
      .filter(
        ({ name }) =>
          name.startsWith('application.extra') ||
          authTypeFields.find((field) => field.name === name) ||
          (hasCustomSteps && endpointFields.find((field) => field.name === name)),
      );
  }

  if (hasCustomSteps) {
    endpointFields = [];
  }

  authTypeFields = injectAuthFieldsInfo(authTypeFields, type.name, hasAuthentication, name || 'generic', hcsEnrolled);
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
            defaultMessage: 'Integration type',
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
            description={
              // overwrite Cost management with HCS
              values.application?.application_type_id === COST_MANAGEMENT_APP_ID && hcsEnrolled ? HCS_APP_NAME : display_name
            }
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
      <SummaryAlert scope={name} sourceType={type.name} hcsEnrolled={hcsEnrolled} />
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
    }),
  ).isRequired,
  applicationTypes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      display_name: PropTypes.string.isRequired,
    }),
  ).isRequired,
  showApp: PropTypes.bool,
  showAuthType: PropTypes.bool,
};

SourceWizardSummary.defaultProps = {
  showApp: true,
  showAuthType: true,
};

export default SourceWizardSummary;
