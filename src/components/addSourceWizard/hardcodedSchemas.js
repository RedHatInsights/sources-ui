import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Button, ButtonVariant, FormHelperText, Popover } from '@patternfly/react-core';

import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import validatorTypes from '@data-driven-forms/react-form-renderer/validator-types';
import SSLFormLabel from './SSLFormLabel';

import * as OpenshiftToken from './hardcodedComponents/openshift/token';
import * as AwsSecret from './hardcodedComponents/aws/access_key';
import * as AwsArn from './hardcodedComponents/aws/arn';

import * as ProvAwsArn from './hardcodedComponents/aws/provisioningArn';
import * as ProvAzure from './hardcodedComponents/azure/provisioning';
import * as ProvGCP from './hardcodedComponents/gcp/provisioning';

import * as SWAwsArn from './hardcodedComponents/aws/subscriptionWatch';
import * as SWAzure from './hardcodedComponents/azure/subscriptionWatch';
import * as SWGoogle from './hardcodedComponents/gcp/subscriptionWatch';

import * as CMOpenshift from './hardcodedComponents/openshift/costManagement';
import * as CMAzure from './hardcodedComponents/azure/costManagement';
import * as CMGoogle from './hardcodedComponents/gcp/costManagement';
import * as CMIbm from './hardcodedComponents/ibm/costManagement';
import * as CMOci from './hardcodedComponents/oci/costManagement';

import * as TowerCatalog from './hardcodedComponents/tower/catalog';
import * as Openshift from './hardcodedComponents/openshift/endpoint';

import {
  CATALOG_APP,
  CLOUD_METER_APP_NAME,
  COST_MANAGEMENT_APP_NAME,
  HCS_NAME,
  PROVISIONING_APP_NAME,
} from '../../utilities/constants';
import emptyAuthType from './emptyAuthType';
import { doLoadRegions } from '../../api/doLoadRegions';

const arnMessagePattern = <FormattedMessage id="wizard.arnPattern" defaultMessage="ARN must start with arn:aws:" />;
const arnMessageLength = <FormattedMessage id="wizard.arnLength" defaultMessage="ARN should have at least 10 characters" />;

const arnField = {
  placeholder: 'arn:aws:iam:123456789:role/CostManagement',
  isRequired: true,
  validate: [
    {
      type: validatorTypes.REQUIRED,
    },
    {
      type: validatorTypes.PATTERN,
      pattern: /^arn:aws:.*/,
      message: arnMessagePattern,
    },
    {
      type: validatorTypes.MIN_LENGTH,
      threshold: 10,
      message: arnMessageLength,
    },
  ],
};

const provArnField = {
  placeholder: 'arn:aws:iam:123456789:role/Provisioning',
  isRequired: true,
  validate: [
    {
      type: validatorTypes.REQUIRED,
    },
    {
      type: validatorTypes.PATTERN,
      pattern: /^arn:aws:.*/,
      message: arnMessagePattern,
    },
    {
      type: validatorTypes.MIN_LENGTH,
      threshold: 10,
      message: arnMessageLength,
    },
  ],
};

const hcsArnField = {
  ...arnField,
  placeholder: 'arn:aws:iam:123456789:role/HybridCommittedSpend',
};

const getArn = (authUsername, showHCS) => ({
  useApplicationAuth: true,
  skipSelection: true,
  'authentication.username': authUsername,
  'application.extra.bucket': {
    placeholder: 'cost-usage-bucket',
    validate: [
      {
        type: validatorTypes.REQUIRED,
      },
      {
        type: validatorTypes.PATTERN,
        pattern:
          /(?!(^((2(5[0-5]|[0-4][0-9])|[01]?[0-9]{1,2})\.){3}(2(5[0-5]|[0-4][0-9])|[01]?[0-9]{1,2})$|^xn--|-s3alias$))^[a-z0-9][a-z0-9.-]{1,61}[a-z0-9]$/,
        message: (
          <FormattedMessage
            id="cost.arn.s3BucketPattern"
            defaultMessage="S3 bucket name must start with alphanumeric character and can contain lowercase letters, numbers, dots, and hyphens"
          />
        ),
      },
    ],
    isRequired: true,
  },
  additionalSteps: [
    {
      title: <FormattedMessage id="cost.arn.storageTitle" defaultMessage="Create storage" />,
      nextStep: 'usage',
      fields: [
        {
          name: 'usage-description',
          component: 'description',
          Content: () => <AwsArn.StorageDescription showHCS={showHCS} />,
        },
        {
          name: 'application.extra.bucket',
          component: componentTypes.TEXT_FIELD,
          label: <FormattedMessage id="cost.arn.s3Label" defaultMessage="S3 bucket name" />,
        },
        {
          name: 'application.extra.bucket_region',
          component: componentTypes.SELECT,
          loadOptions: () => doLoadRegions().then((data) => data.map((item) => ({ value: item, label: item }))),
          label: <FormattedMessage id="cost.arn.awsRegion" defaultMessage="AWS region" />,
          placeholder: 'Select a region',
          validate: [
            {
              type: validatorTypes.REQUIRED,
            },
          ],
          isRequired: true,
        },
      ],
    },
    {
      title: <FormattedMessage id="cost.arn.usageDescriptionTitle" defaultMessage="Create cost and usage report" />,
      name: 'usage',
      nextStep: 'tags',
      fields: [
        {
          name: 'usage-description',
          component: 'description',
          Content: () => <AwsArn.UsageDescription showHCS={showHCS} />,
        },
        {
          name: 'application.extra.storage_only',
          component: 'enhanced-radio',
          className: 'src-c-wizard__conditional-radio',
          options: [
            {
              label: (
                <FormattedMessage
                  id="cost.arn.sendDefaultCUR"
                  defaultMessage="I am OK with sending the default CUR to Cost Management"
                />
              ),
              value: false,
            },
            {
              label: (
                <span>
                  <FormattedMessage
                    id="cost.arn.customizeCUR"
                    defaultMessage="I wish to manually customize the CUR sent to Cost Management"
                  />{' '}
                  <Popover
                    aria-label="Help text"
                    position="right"
                    maxWidth="5%"
                    bodyContent={
                      <FormattedMessage
                        id="cost.arn.helpCustomizeCUR"
                        defaultMessage="There will be a set of instructions at the end of this wizard that will guide you on how to complete the customize configuration that will be completed in the AWS console."
                      />
                    }
                  >
                    <Button className="pf-u-p-0 pf-u-m-0" variant={ButtonVariant.plain}>
                      <QuestionCircleIcon className="pf-u-ml-sm" />
                    </Button>
                  </Popover>
                </span>
              ),
              value: true,
            },
          ],
          mutator: (option) => option,
          initialValue: false,
          initializeOnMount: true,
          hideInReview: true,
        },
        {
          name: 'usage-description',
          component: 'description',
          Content: () => <AwsArn.UsageSteps />,
        },
        {
          component: componentTypes.TEXT_FIELD,
          name: 'authentication.authtype',
          hideField: true,
          initialValue: 'arn',
          initializeOnMount: true,
        },
      ],
    },
    {
      title: <FormattedMessage id="cost.arn.tagsStepTitle" defaultMessage="Tags, aliases and organizational units" />,
      name: 'tags',
      nextStep: 'iam-policy',
      fields: [
        {
          name: 'tags-description',
          component: 'description',
          Content: () => <AwsArn.TagsDescription showHCS={showHCS} />,
        },
        {
          name: 'aws.aliases.enabled',
          component: 'checkbox-with-icon',
          label: <FormattedMessage id="cost.arn.includesAliases" defaultMessage="Include AWS account aliases" />,
          Icon: AwsArn.IncludeAliasesLabel,
        },
        {
          name: 'aws.org_units.enabled',
          component: 'checkbox-with-icon',
          label: <FormattedMessage id="cost.arn.includeOrgUnits" defaultMessage="Include AWS organizational units" />,
          Icon: AwsArn.IncludeOrgUnitsLabel,
        },
      ],
    },
    {
      title: <FormattedMessage id="cost.arn.iamPolicyTitle" defaultMessage="Create IAM policy" />,
      name: 'iam-policy',
      nextStep: 'iam-role',
      substepOf: {
        name: 'eaa',
        title: <FormattedMessage id="cost.arn.enableAccountAccess" defaultMessage="Enable account access" />,
      },
      fields: [
        {
          name: 'iam-policy-description',
          component: 'description',
          Content: () => <AwsArn.IAMPolicyDescription showHCS={showHCS} />,
        },
      ],
    },
    {
      title: <FormattedMessage id="cost.arn.iamRoleStepTitle" defaultMessage="Create IAM role" />,
      name: 'iam-role',
      nextStep: 'arn',
      substepOf: 'eaa',
      fields: [
        {
          name: 'iam-role-description',
          component: 'description',
          Content: AwsArn.IAMRoleDescription,
        },
      ],
    },
    {
      title: <FormattedMessage id="cost.arn.enterArn" defaultMessage="Enter ARN" />,
      name: 'arn',
      substepOf: 'eaa',
      fields: [
        {
          name: 'arn-description',
          component: 'description',
          Content: AwsArn.ArnDescription,
        },
      ],
    },
  ],
});

const subsWatchArnField = {
  placeholder: 'arn:aws:iam:123456789:role/SubscriptionWatch',
  isRequired: true,
  validate: [
    {
      type: validatorTypes.REQUIRED,
    },
    {
      type: validatorTypes.PATTERN,
      pattern: /^arn:aws:.*/,
      message: arnMessagePattern,
    },
    {
      type: validatorTypes.MIN_LENGTH,
      threshold: 10,
      message: arnMessageLength,
    },
  ],
  label: <FormattedMessage id="wizard.arn" defaultMessage="ARN" />,
};

const ansibleTowerURL = {
  isRequired: true,
  validate: [
    { type: validatorTypes.REQUIRED },
    {
      type: validatorTypes.PATTERN,
      message: <FormattedMessage id="catalog.urlPatternMessage" defaultMessage="URL must start with https:// or http://" />,
      pattern: /^https{0,1}:\/\//,
    },
    { type: validatorTypes.URL },
  ],
  helperText: (
    <FormHelperText isHidden={false}>
      <FormattedMessage
        id="catalog.hostnameHelper"
        defaultMessage="For example, https://myansibleinstance.example.com/ or https://127.0.0.1/"
      />
    </FormHelperText>
  ),
  label: <FormattedMessage id="wizard.hostname" defaultMessage="Hostname" />,
};

const hardcodedSchemas = {
  ibm: {
    authentication: {
      api_token_account_id: {
        generic: {
          skipEndpoint: true,
        },
        [COST_MANAGEMENT_APP_NAME]: {
          skipSelection: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="cost.ibm.enterpriseIdTitle" defaultMessage="Add enterprise ID" />,
              showTitle: false,
              fields: [
                {
                  name: 'authentication.authtype',
                  component: 'text-field',
                  hideField: true,
                  initialValue: 'api_token_account_id',
                  initializeOnMount: true,
                },
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMIbm.EnterpriseId,
                },
                {
                  name: 'application.extra.enterprise_id',
                  label: 'Enterprise ID',
                  validate: [
                    {
                      type: 'required',
                    },
                  ],
                  component: 'text-field',
                  isRequired: true,
                },
              ],
              nextStep: 'ibm-cm-account-id',
              substepOf: {
                name: 'ibm-cm-substep',
                title: <FormattedMessage id="cost.ibm.substepTitle" defaultMessage="Enter account IDs" />,
              },
            },
            {
              title: <FormattedMessage id="cost.ibm.accountIdTitle" defaultMessage="Add account ID" />,
              showTitle: false,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMIbm.AccountId,
                },
                {
                  name: 'authentication.username',
                  label: 'Account ID',
                  component: 'text-field',
                  validate: [
                    {
                      type: 'required',
                    },
                  ],
                  isRequired: true,
                },
              ],
              nextStep: 'ibm-cm-service-id',
              substepOf: 'ibm-cm-substep',
              name: 'ibm-cm-account-id',
            },
            {
              title: <FormattedMessage id="cost.ibm.serviceIdTitle" defaultMessage="Create a service ID" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMIbm.ServiceId,
                },
                {
                  name: 'cost.service_id',
                  component: 'text-field',
                  label: 'Service ID',
                  validate: [
                    {
                      type: 'required',
                    },
                  ],
                  isRequired: true,
                },
              ],
              nextStep: 'ibm-cm-configure-access',
              name: 'ibm-cm-service-id',
            },
            {
              title: <FormattedMessage id="cost.ibm.accessId" defaultMessage="Configure service ID access" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMIbm.ConfigureAccess,
                },
              ],
              nextStep: 'ibm-cm-api-key',
              name: 'ibm-cm-configure-access',
            },
            {
              title: <FormattedMessage id="cost.ibm.apiKeyTitle" defaultMessage="Create an API key" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMIbm.ApiKey,
                },
                {
                  name: 'authentication.password',
                  label: 'API Key',
                  validate: [
                    {
                      type: 'required',
                    },
                  ],
                  component: 'text-field',
                  isRequired: true,
                  type: 'password',
                },
              ],
              name: 'ibm-cm-api-key',
            },
          ],
        },
      },
    },
  },
  openshift: {
    authentication: {
      token: {
        generic: {
          'authentication.password': {
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
          },
          additionalFields: [
            {
              component: 'description',
              name: 'description-summary',
              Content: OpenshiftToken.DescriptionSummary,
            },
          ],
        },
        [COST_MANAGEMENT_APP_NAME]: {
          skipSelection: true,
          skipEndpoint: true,
          'source.source_ref': {
            label: <FormattedMessage id="wizard.clusterId" defaultMessage="Cluster Identifier" />,
            isRequired: true,
            component: componentTypes.TEXT_FIELD,
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.PATTERN,
                pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                message: (
                  <FormattedMessage
                    id="wizard.clusterIdPattern"
                    defaultMessage="Cluster ID must start with alphanumeric character and can contain underscore and hyphen"
                  />
                ),
              },
            ],
          },
          additionalSteps: [
            {
              title: <FormattedMessage id="cost.configureOperator" defaultMessage="Install and configure operator" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMOpenshift.ConfigureCostOperator,
                },
                {
                  name: 'source.source_ref',
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'token',
                  initializeOnMount: true,
                },
              ],
            },
          ],
        },
      },
    },
    endpoint: {
      url: {
        placeholder: 'https://myopenshiftcluster.mycompany.com',
        isRequired: true,
        validate: [
          { type: validatorTypes.REQUIRED },
          {
            type: validatorTypes.URL,
            message: <FormattedMessage id="wizard.urlPatternMessage" defaultMessage="The URL is not formatted correctly." />,
          },
        ],
      },
      'endpoint.certificate_authority': {
        label: <SSLFormLabel />,
        'aria-label': 'SSL Certificate',
      },
      additionalFields: [
        {
          component: 'description',
          name: 'description-summary',
          Content: Openshift.EndpointDesc,
        },
      ],
    },
  },
  azure: {
    authentication: {
      username_password_tenant_id: {
        generic: {
          'authentication.extra.azure.tenant_id': {
            type: 'password',
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
          },
          'authentication.username': {
            label: <FormattedMessage id="azure.generic.username" defaultMessage="App ID" />,
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
          },
          'authentication.password': {
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
          },
        },
      },
      lighthouse_subscription_id_legacy: {
        [CLOUD_METER_APP_NAME]: {
          skipSelection: true,
          useApplicationAuth: true,
          customSteps: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="subwatch.azure.tokenTitle" defaultMessage="Obtain offline token" />,
              nextStep: 'cost-azure-playbook',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage id="subwatch.azure.substepTitle" defaultMessage="Enable account access" />,
              },
              fields: [
                {
                  name: 'azure-1',
                  component: 'description',
                  Content: SWAzure.OfflineToken,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: emptyAuthType.type,
                  initializeOnMount: true,
                },
              ],
            },
            {
              title: <FormattedMessage id="subwatch.azure.playbookTitle" defaultMessage="Run Ansible playbook" />,
              name: 'cost-azure-playbook',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'azure-2',
                  component: 'description',
                  Content: SWAzure.AnsiblePlaybook,
                },
              ],
            },
          ],
        },
      },
      lighthouse_subscription_id: {
        [CLOUD_METER_APP_NAME]: {
          skipSelection: true,
          useApplicationAuth: true,
          customSteps: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="subwatch.lighthouse.title" defaultMessage="Configure Azure Lighthouse" />,
              nextStep: 'subwatch-lighthouse-sub-id',
              fields: [
                {
                  name: 'azure-1',
                  component: 'description',
                  Content: SWAzure.LightHouseDescription,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'lighthouse_subscription_id',
                  initializeOnMount: true,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'lighthouse-clicked',
                  hideField: true,
                  validate: [{ type: 'required' }],
                },
              ],
            },
            {
              title: <FormattedMessage id="subwatch.lighthouse.subscriptionId" defaultMessage="Set subscription ID" />,
              name: 'subwatch-lighthouse-sub-id',
              fields: [
                {
                  name: 'azure-2',
                  component: 'description',
                  Content: SWAzure.SubscriptionID,
                },
                {
                  component: 'text-field',
                  name: 'authentication.username',
                  label: 'Subscription ID',
                  isRequired: true,
                  placeholder: '291bba3f-e0a5-47bc-a099-3bdcb2a50a05',
                  validate: [{ type: 'required' }],
                },
              ],
            },
          ],
        },
      },
      tenant_id_client_id_client_secret: {
        [COST_MANAGEMENT_APP_NAME]: {
          useApplicationAuth: true,
          skipSelection: true,
          'application.extra.subscription_id': {
            placeholder: '',
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.PATTERN,
                pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                message: (
                  <FormattedMessage
                    id="cost.subidPattern"
                    defaultMessage="Subscription ID must start with alphanumeric character and can contain underscore and hyphen"
                  />
                ),
              },
            ],
            isRequired: true,
          },
          'application.extra.resource_group': {
            placeholder: '',
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.PATTERN,
                pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                message: (
                  <FormattedMessage
                    id="cost.resourceGroupPattern"
                    defaultMessage="Resource group must start with alphanumeric character and can contain underscore and hyphen"
                  />
                ),
              },
            ],
          },
          'application.extra.storage_account': {
            placeholder: '',
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.PATTERN,
                pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                message: (
                  <FormattedMessage
                    id="cost.storageAccountPattern"
                    defaultMessage="Storage account must start with alphanumeric character and can contain underscore and hyphen"
                  />
                ),
              },
            ],
          },
          'application.extra.scope': {
            placeholder: '',
            validate: [
              {
                type: validatorTypes.PATTERN,
                pattern: /^[\/A-Za-z0-9]+[\.\/\:A-Za-z0-9_-]*$/, // eslint-disable-line no-useless-escape
                message: (
                  <FormattedMessage
                    id="cost.scopePattern"
                    defaultMessage="Cost export scope must start with alphanumeric character and can contain underscore, hyphen, and foward slash"
                  />
                ),
              },
            ],
          },
          'application.extra.export_name': {
            placeholder: '',
            validate: [
              {
                type: validatorTypes.PATTERN,
                pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                message: (
                  <FormattedMessage
                    id="cost.exportNamePattern"
                    defaultMessage="Cost export name must start with alphanumeric character and can contain underscore and hyphen"
                  />
                ),
              },
            ],
          },
          'authentication.password': {
            type: 'password',
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
            ],
            label: <FormattedMessage id="cost.clientSecret" defaultMessage="Client secret" />,
          },
          'authentication.username': {
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
            ],
            label: <FormattedMessage id="cost.clientAppId" defaultMessage="Client (Application) ID" />,
          },
          'authentication.extra.azure.tenant_id': {
            label: <FormattedMessage id="cost.tenantDirId" defaultMessage="Tenant (Directory) ID" />,
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
            ],
          },
          additionalSteps: [
            {
              title: <FormattedMessage id="cost.createDailyExport" defaultMessage="Specify cost export scope" />,
              nextStep: 'azure-rg-and-sa',
              fields: [
                {
                  name: 'cost-export-scope-description',
                  component: 'description',
                  Content: CMAzure.ExportScopeDescription,
                },
                {
                  name: 'application.extra.storage_only',
                  component: 'enhanced-radio',
                  className: 'src-c-wizard__conditional-radio',
                  options: [
                    {
                      label: (
                        <FormattedMessage
                          id="cost.sendDefaultCUR"
                          defaultMessage="I am OK with sending the default CUR to Cost Management"
                        />
                      ),
                      value: false,
                    },
                    {
                      label: (
                        <FormattedMessage
                          id="cost.customizeCUR"
                          defaultMessage="I wish to manually customize the CUR sent to Cost Management"
                        />
                      ),
                      value: true,
                    },
                  ],
                  mutator: (option) => option,
                  initialValue: false,
                  hideInReview: true,
                },
                {
                  name: 'cost-export-scope',
                  component: 'description',
                  Content: CMAzure.ExportScope,
                },
                {
                  name: 'application.extra.scope',
                  component: componentTypes.TEXT_FIELD,
                  label: <FormattedMessage id="wizard.costExportScope" defaultMessage="Cost export scope" />,
                  condition: { when: 'application.extra.storage_only', is: false },
                },
              ],
            },
            {
              title: <FormattedMessage id="cost.createDailyExport" defaultMessage="Daily export" />,
              name: 'daily-export',
              nextStep: 'azure-sub-id',
              fields: [
                {
                  name: 'export-schedule-description',
                  component: 'description',
                  Content: CMAzure.ExportSchedule,
                },
                {
                  name: 'application.extra.export_name',
                  component: componentTypes.TEXT_FIELD,
                  label: <FormattedMessage id="wizard.costExportName" defaultMessage="Cost export name" />,
                  condition: { when: 'application.extra.storage_only', is: false },
                },
              ],
            },
            {
              title: <FormattedMessage id="cost.azureSubStepId" defaultMessage="Resource group and storage account" />,
              name: 'azure-rg-and-sa',
              nextStep: 'daily-export',
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'tenant_id_client_id_client_secret',
                  initializeOnMount: true,
                },
                {
                  name: 'azure-storage-account-description',
                  component: 'description',
                  Content: CMAzure.ConfigureResourceGroupAndStorageAccount,
                },
                {
                  name: 'all-required',
                  component: 'description',
                  Content: TowerCatalog.AllFieldAreRequired,
                },
                {
                  name: 'application.extra.resource_group',
                  component: componentTypes.TEXT_FIELD,
                  label: <FormattedMessage id="wizard.resourceGroupName" defaultMessage="Resource group name" />,
                },
                {
                  name: 'application.extra.storage_account',
                  component: componentTypes.TEXT_FIELD,
                  label: <FormattedMessage id="wizard.storageAccountName" defaultMessage="Storage account name" />,
                },
              ],
            },
            {
              title: <FormattedMessage id="wizard.subscriptionId" defaultMessage="Subscription ID" />,
              name: 'azure-sub-id',
              nextStep: 'configure-roles',
              fields: [
                {
                  name: 'azure-sub-id-description',
                  component: 'description',
                  Content: CMAzure.SubscriptionID,
                },
                {
                  name: 'application.extra.subscription_id',
                  component: componentTypes.TEXT_FIELD,
                  label: <FormattedMessage id="wizard.subscriptionId" defaultMessage="Subscription ID" />,
                },
              ],
            },
            {
              title: <FormattedMessage id="wizard.configureRoles" defaultMessage="Roles" />,
              name: 'configure-roles',
              fields: [
                {
                  name: 'configure-service-principal',
                  component: 'description',
                  Content: CMAzure.ConfigureRolesDescription,
                },
                {
                  name: 'all-required',
                  component: 'description',
                  Content: TowerCatalog.AllFieldAreRequired,
                },
                {
                  name: 'authentication.extra.azure.tenant_id',
                  component: componentTypes.TEXT_FIELD,
                },
                {
                  name: 'authentication.username',
                  component: componentTypes.TEXT_FIELD,
                },
                {
                  name: 'authentication.password',
                  component: componentTypes.TEXT_FIELD,
                },
                {
                  name: 'reader-role',
                  component: 'description',
                  Content: CMAzure.ReaderRoleDescription,
                },
              ],
            },
          ],
        },
      },
      provisioning_lighthouse_subscription_id: {
        [PROVISIONING_APP_NAME]: {
          skipSelection: true,
          useApplicationAuth: true,
          customSteps: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="provisioning.lighthouse.title" defaultMessage="Configure Azure Lighthouse" />,
              nextStep: 'provisioning-lighthouse-sub-id',
              fields: [
                {
                  name: 'azure-1',
                  component: 'description',
                  Content: ProvAzure.LighthouseDescription,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'provisioning_lighthouse_subscription_id',
                  initializeOnMount: true,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'lighthouse-clicked',
                  hideField: true,
                  validate: [{ type: 'required' }],
                },
              ],
            },
            {
              title: <FormattedMessage id="provisioning.lighthouse.subscriptionId" defaultMessage="Set subscription ID" />,
              name: 'provisioning-lighthouse-sub-id',
              fields: [
                {
                  name: 'azure-2',
                  component: 'description',
                  Content: ProvAzure.SubscriptionID,
                },
                {
                  component: 'text-field',
                  name: 'authentication.username',
                  label: 'Subscription ID',
                  isRequired: true,
                  placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
                  validate: [{ type: 'required' }],
                },
              ],
            },
          ],
        },
      },
    },
  },
  amazon: {
    authentication: {
      access_key_secret_key: {
        generic: {
          'authentication.username': {
            label: <FormattedMessage id="wizard.accessKeyId" defaultMessage="Access key ID" />,
            placeholder: 'AKIAIOSFODNN7EXAMPLE',
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
          },
          'authentication.password': {
            label: <FormattedMessage id="wizard.secretAccessKey" defaultMessage="Secret access key" />,
            placeholder: 'wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
            type: 'password',
          },
          skipSelection: true,
          onlyHiddenFields: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="wizard.configureAccountAccess" defaultMessage="Account access" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: AwsSecret.DescriptionSummary,
                },
                {
                  name: 'authentication.username',
                  component: componentTypes.TEXT_FIELD,
                },
                {
                  name: 'authentication.password',
                  component: componentTypes.TEXT_FIELD,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'access_key_secret_key',
                  initializeOnMount: true,
                },
              ],
            },
          ],
        },
      },
      arn: {
        generic: {
          includeStepKeyFields: ['arn'],
          'authentication.username': arnField,
        },
        [COST_MANAGEMENT_APP_NAME]: (() => {
          return getArn(arnField, false);
        })(),
        [HCS_NAME]: getArn(hcsArnField, true),
      },
      'cloud-meter-arn': {
        generic: {
          includeStepKeyFields: ['arn'],
          'authentication.username': subsWatchArnField,
        },
        [CLOUD_METER_APP_NAME]: {
          useApplicationAuth: true,
          skipSelection: true,
          'authentication.username': subsWatchArnField,
          additionalSteps: [
            {
              title: <FormattedMessage id="cloudmeter.createIamPolicy" defaultMessage="Create IAM policy" />,
              nextStep: 'subs-iam-role',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage id="cloudmeter.enableAccountAccess" defaultMessage="Enable account access" />,
              },
              fields: [
                {
                  name: 'iam-policy-description',
                  component: 'description',
                  Content: SWAwsArn.IAMPolicyDescription,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'cloud-meter-arn',
                  initializeOnMount: true,
                },
              ],
            },
            {
              title: <FormattedMessage id="cloudmeter.createIamRole" defaultMessage="Create IAM role" />,
              name: 'subs-iam-role',
              nextStep: 'subs-arn',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'iam-role-description',
                  component: 'description',
                  Content: SWAwsArn.IAMRoleDescription,
                },
              ],
            },
            {
              title: <FormattedMessage id="cloudmeter.enterArn" defaultMessage="Enter ARN" />,
              name: 'subs-arn',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'arn-description',
                  component: 'description',
                  Content: SWAwsArn.ArnDescription,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.username',
                },
              ],
            },
          ],
        },
      },
      'provisioning-arn': {
        generic: {
          includeStepKeyFields: ['provisioning-arn'],
          'authentication.username': provArnField,
        },
        [PROVISIONING_APP_NAME]: {
          useApplicationAuth: true,
          skipSelection: true,
          'authentication.username': provArnField,
          additionalSteps: [
            {
              title: <FormattedMessage id="provisioning.createIamPolicy" defaultMessage="Create IAM policy" />,
              nextStep: 'prov-iam-role',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage id="provisioning.enableAccountAccess" defaultMessage="Enable account access" />,
              },
              fields: [
                {
                  name: 'iam-policy-description',
                  component: 'description',
                  Content: ProvAwsArn.IAMPolicyDescription,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'provisioning-arn',
                  initializeOnMount: true,
                },
              ],
            },
            {
              title: <FormattedMessage id="provisioning.createIamRole" defaultMessage="Create IAM role" />,
              name: 'prov-iam-role',
              nextStep: 'prov-arn',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'iam-role-description',
                  component: 'description',
                  Content: ProvAwsArn.IAMRoleDescription,
                },
              ],
            },
            {
              title: <FormattedMessage id="provisioning.enterArn" defaultMessage="Enter ARN" />,
              name: 'prov-arn',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'arn-description',
                  component: 'description',
                  Content: ProvAwsArn.ArnDescription,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.username',
                },
              ],
            },
          ],
        },
      },
    },
    endpoint: {},
  },
  satellite: {
    endpoint: {},
    authentication: {
      receptor_node: {
        generic: {
          'source.source_ref': {
            label: <FormattedMessage id="satellite.satelliteId" defaultMessage="Satellite ID" />,
            validate: [{ type: validatorTypes.REQUIRED }],
            component: componentTypes.TEXT_FIELD,
          },
          'endpoint.receptor_node': {
            label: <FormattedMessage id="satellite.receptorId" defaultMessage="Receptor ID" />,
            validate: [{ type: validatorTypes.REQUIRED }],
            component: componentTypes.TEXT_FIELD,
          },
          skipSelection: true,
          onlyHiddenFields: true,
          customSteps: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="satellite.credentials" defaultMessage="Credentials" />,
              nextStep: 'summary',
              fields: [
                {
                  name: 'all-required',
                  component: 'description',
                  Content: TowerCatalog.AllFieldAreRequired,
                },
                {
                  name: 'source.source_ref',
                },
                {
                  name: 'endpoint.receptor_node',
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'endpoint.role',
                  hideField: true,
                  initializeOnMount: true,
                  initialValue: 'satellite',
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initializeOnMount: true,
                  initialValue: 'receptor_node',
                },
              ],
            },
          ],
        },
      },
    },
  },
  'ansible-tower': {
    authentication: {
      receptor_node: {
        generic: {
          skipEndpoint: true,
        },
        [CATALOG_APP]: {
          skipEndpoint: true,
        },
      },
      username_password: {
        generic: {
          skipSelection: true,
          onlyHiddenFields: true,
          customSteps: true,
          'authentication.username': {
            isRequired: false,
            validate: [{ type: validatorTypes.REQUIRED }],
            label: <FormattedMessage id="wizard.username" defaultMessage="Username" />,
          },
          'authentication.password': {
            type: 'password',
            isRequired: false,
            validate: [{ type: validatorTypes.REQUIRED }],
            label: <FormattedMessage id="wizard.password" defaultMessage="Password" />,
          },
          url: ansibleTowerURL,
          'endpoint.certificate_authority': {
            label: <FormattedMessage id="wizard.certificateAuthoriy" defaultMessage="Certificate authority" />,
          },
          'endpoint.verify_ssl': {
            initialValue: false,
            label: <FormattedMessage id="wizard.verifySsl" defaultMessage="Verify SSL" />,
          },
          additionalSteps: [
            {
              title: <FormattedMessage id="wizard.credentials" defaultMessage="Credentials" />,
              nextStep: 'ansible-tower-credentials-no-app',
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'username_password',
                  initializeOnMount: true,
                },
                {
                  name: 'required-desc',
                  component: 'description',
                  Content: TowerCatalog.AllFieldAreRequired,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.username',
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.password',
                },
              ],
            },
            {
              name: 'ansible-tower-credentials-no-app',
              title: <FormattedMessage id="catalog.ansibleTowerEndpoint" defaultMessage="Ansible Tower endpoint" />,
              fields: [
                {
                  name: 'endpoint.role',
                  component: componentTypes.TEXT_FIELD,
                  hideField: true,
                  initialValue: 'ansible',
                  initializeOnMount: true,
                },
                {
                  name: 'url',
                  component: componentTypes.TEXT_FIELD,
                },
                {
                  name: 'endpoint.verify_ssl',
                  component: componentTypes.SWITCH,
                },
                {
                  name: 'endpoint.certificate_authority',
                  component: componentTypes.TEXT_FIELD,
                  condition: { is: true, when: 'endpoint.verify_ssl' },
                },
              ],
            },
          ],
        },
        [CATALOG_APP]: {
          skipSelection: true,
          onlyHiddenFields: true,
          customSteps: true,
          'authentication.username': {
            isRequired: false,
            validate: [{ type: validatorTypes.REQUIRED }],
            label: <FormattedMessage id="wizard.username" defaultMessage="Username" />,
          },
          'authentication.password': {
            type: 'password',
            isRequired: false,
            validate: [{ type: validatorTypes.REQUIRED }],
            label: <FormattedMessage id="wizard.password" defaultMessage="Password" />,
          },
          url: ansibleTowerURL,
          'endpoint.certificate_authority': {
            label: <FormattedMessage id="wizard.certificateAuthoriy" defaultMessage="Certificate authority" />,
          },
          'endpoint.verify_ssl': {
            initialValue: false,
            label: <FormattedMessage id="wizard.verifySsl" defaultMessage="Verify SSL" />,
          },
          additionalSteps: [
            {
              nextStep: 'catalog-ansible-tower',
              title: <FormattedMessage id="catalog.ansibleTowerEndpoint" defaultMessage="Ansible Tower endpoint" />,
              fields: [
                {
                  name: 'ansible-tower-desc',
                  component: 'description',
                  Content: TowerCatalog.EndpointDescription,
                },
                {
                  name: 'endpoint.role',
                  component: componentTypes.TEXT_FIELD,
                  hideField: true,
                  initialValue: 'ansible',
                  initializeOnMount: true,
                },
                {
                  name: 'url',
                  component: componentTypes.TEXT_FIELD,
                },
                {
                  name: 'endpoint.verify_ssl',
                  component: componentTypes.SWITCH,
                },
                {
                  name: 'endpoint.certificate_authority',
                  component: componentTypes.TEXT_FIELD,
                  condition: { is: true, when: 'endpoint.verify_ssl' },
                },
              ],
            },
            {
              title: <FormattedMessage id="wizard.credentials" defaultMessage="Credentials" />,
              name: 'catalog-ansible-tower',
              fields: [
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'username_password',
                  initializeOnMount: true,
                },
                {
                  name: 'required-desc',
                  component: 'description',
                  Content: TowerCatalog.AuthDescription,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.username',
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.password',
                },
              ],
            },
          ],
        },
      },
    },
    endpoint: {
      url: ansibleTowerURL,
      'endpoint.certificate_authority': {
        label: <FormattedMessage id="wizard.certificateAuthority" defaultMessage="Certificate authority" />,
      },
      'endpoint.verify_ssl': {
        initialValue: false,
      },
    },
  },
  google: {
    authentication: {
      [emptyAuthType.type]: {
        [CLOUD_METER_APP_NAME]: {
          skipSelection: true,
          useApplicationAuth: true,
          customSteps: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="subwatch.azure.tokenTitle" defaultMessage="Obtain offline token" />,
              nextStep: 'cost-google-playbook',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage id="subwatch.azure.substepTitle" defaultMessage="Enable account access" />,
              },
              fields: [
                {
                  name: 'azure-1',
                  component: 'description',
                  Content: SWGoogle.OfflineToken,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: emptyAuthType.type,
                  initializeOnMount: true,
                },
              ],
            },
            {
              title: <FormattedMessage id="subwatch.azure.playbookTitle" defaultMessage="Run Ansible playbook" />,
              name: 'cost-google-playbook',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'azure-2',
                  component: 'description',
                  Content: SWGoogle.AnsiblePlaybook,
                },
              ],
            },
          ],
        },
      },
      provisioning_project_id: {
        generic: {
          includeStepKeyFields: ['provisioning_project_id'],
        },
        [PROVISIONING_APP_NAME]: {
          skipSelection: true,
          useApplicationAuth: true,
          customSteps: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="provisioning.enterProjectID" defaultMessage="Enter Project ID" />,
              nextStep: 'prov-custom-role',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage id="provisioning.enableAccountAccess" defaultMessage="Enable account access" />,
              },
              fields: [
                {
                  name: 'add-project-id',
                  component: 'description',
                  Content: ProvGCP.ProjectID,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.username',
                  isRequired: true,
                  label: 'Project ID',
                  placeholder: 'project_id',
                  validate: [{ type: 'required' }],
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'authentication.authtype',
                  hideField: true,
                  initialValue: 'provisioning_project_id',
                  initializeOnMount: true,
                },
              ],
            },
            {
              title: <FormattedMessage id="provisioning.createRole" defaultMessage="Create custom role" />,
              name: 'prov-custom-role',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'custom-role-description',
                  component: 'description',
                  Content: ProvGCP.AddRole,
                },
              ],
            },
          ],
        },
      },
      project_id_service_account_json: {
        [COST_MANAGEMENT_APP_NAME]: {
          useApplicationAuth: true,
          skipSelection: true,
          'authentication.username': {
            component: 'text-field',
            label: 'Project ID',
            placeholder: '0123456789',
            isRequired: true,
            validate: [
              {
                type: 'required',
              },
            ],
          },
          'authentication.authtype': {
            component: 'text-field',
            hideField: true,
            initialValue: 'project_id_service_account_json',
          },
          'application.extra.dataset': {
            component: 'text-field',
            label: 'Dataset ID',
            isRequired: true,
            validate: [
              {
                type: 'required',
              },
            ],
          },
          additionalSteps: [
            {
              title: <FormattedMessage id="cost.gcp.projectTitle" defaultMessage="Project" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-google',
                  Content: CMGoogle.Project,
                },
                {
                  name: 'authentication.username',
                },
                {
                  name: 'authentication.authtype',
                },
                {
                  component: 'description',
                  name: 'description-google',
                  Content: CMGoogle.ProjectDescription,
                },
                {
                  name: 'application.extra.storage_only',
                  component: 'enhanced-radio',
                  className: 'src-c-wizard__conditional-radio',
                  options: [
                    {
                      label: (
                        <FormattedMessage
                          id="cost.gcp.sendDefaultCUR"
                          defaultMessage="I am OK with sending the default dataset to Cost Management"
                        />
                      ),
                      value: false,
                    },
                    {
                      label: (
                        <span>
                          <FormattedMessage
                            id="cost.gcp.customizeCUR"
                            defaultMessage="I wish to manually customize the dataset sent to Cost Management"
                          />
                        </span>
                      ),
                      value: true,
                    },
                  ],
                  mutator: (option) => option,
                  initialValue: false,
                  initializeOnMount: true,
                  hideInReview: true,
                },
              ],
              nextStep: ({
                values: {
                  application: { extra },
                },
              }) => {
                return extra?.storage_only ? 'cost-gcp-cs' : 'cost-gcp-iam';
              },
            },
            {
              title: <FormattedMessage id="cost.gcp.cloudStorage" defaultMessage="Create cloud storage bucket" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-google',
                  Content: CMGoogle.CloudStorageBucket,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'application.extra.bucket',
                  label: 'Cloud storage bucket name',
                  validate: [
                    {
                      type: validatorTypes.REQUIRED,
                    },
                  ],
                  isRequired: true,
                },
              ],
              name: 'cost-gcp-cs',
              nextStep: 'cost-gcp-iam',
            },
            {
              title: <FormattedMessage id="cost.gcp.iamTitle" defaultMessage="Create IAM role" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-google',
                  Content: CMGoogle.IAMRole,
                },
              ],
              nextStep: 'cost-gcp-access',
              name: 'cost-gcp-iam',
              substepOf: {
                name: 'geaa',
                title: <FormattedMessage id="cost.arn.enableAccountAccess" defaultMessage="Enable account access" />,
              },
            },
            {
              title: <FormattedMessage id="cost.gcp.accessTitle" defaultMessage="Assign access" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-google',
                  Content: CMGoogle.AssignAccess,
                },
              ],
              name: 'cost-gcp-access',
              nextStep: 'cost-gcp-dataset',
              substepOf: 'geaa',
            },
            {
              title: <FormattedMessage id="cost.gcp.datasetTitle" defaultMessage="Create dataset" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-google',
                  Content: CMGoogle.Dataset,
                },
                {
                  name: 'application.extra.dataset',
                  condition: {
                    when: 'application.extra.storage_only',
                    is: false,
                  },
                },
              ],
              name: 'cost-gcp-dataset',
              nextStep: 'cost-gcp-billing-export',
            },
            {
              title: <FormattedMessage id="cost.gcp.billingExportTitle" defaultMessage="Billing export" />,
              fields: [
                {
                  component: 'description',
                  name: 'description-google',
                  Content: CMGoogle.BillingExport,
                },
              ],
              name: 'cost-gcp-billing-export',
            },
          ],
        },
      },
    },
  },
  'oracle-cloud-infrastructure': {
    authentication: {
      ocid: {
        generic: {
          skipEndpoint: true,
        },
        [COST_MANAGEMENT_APP_NAME]: {
          skipSelection: true,
          additionalSteps: [
            {
              title: <FormattedMessage id="wizard.globalCompartmentId" defaultMessage="Global compartment-id" />,
              showTitle: false,
              fields: [
                {
                  name: 'authentication.authtype',
                  component: 'text-field',
                  hideField: true,
                  initialValue: 'ocid',
                  initializeOnMount: true,
                },
                {
                  name: 'authentication.username',
                  component: 'text-field',
                  hideField: true,
                  initialValue: 'ocid.uuid',
                  initializeOnMount: true,
                },
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMOci.CompartmentId,
                  fields: [
                    {
                      name: 'application.extra.compartment_id',
                      label: 'Global compartment-id (tenant-id)',
                      validate: [
                        {
                          type: 'required',
                        },
                      ],
                      component: 'text-field',
                      placeholder: 'compartment-id',
                      isRequired: true,
                    },
                  ],
                },
              ],
              nextStep: 'oci-cm-policy-compartment',
            },
            {
              title: <FormattedMessage id="wizard.policyCompartment" defaultMessage="New policy and compartment" />,
              showTitle: false,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMOci.PolicyCompartment,
                  fields: [
                    {
                      name: 'application.extra.policy_compartment',
                      label: 'New compartment-id',
                      validate: [
                        {
                          type: 'required',
                        },
                      ],
                      component: 'text-field',
                      placeholder: 'New compartment-id',
                      isRequired: true,
                    },
                  ],
                },
              ],
              name: 'oci-cm-policy-compartment',
              nextStep: 'oci-cm-create-bucket',
            },
            {
              title: <FormattedMessage id="wizard.createBucket" defaultMessage="Create bucket" />,
              showTitle: false,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMOci.CreateBucket,
                  fields: [
                    {
                      name: 'application.extra.bucket',
                      label: 'New data bucket name',
                      validate: [
                        {
                          type: 'required',
                        },
                      ],
                      component: 'text-field',
                      placeholder: 'cost-management',
                      isRequired: true,
                    },
                    {
                      name: 'application.extra.bucket_namespace',
                      label: 'New data bucket namespace',
                      validate: [
                        {
                          type: 'required',
                        },
                      ],
                      component: 'text-field',
                      placeholder: 'yyhddfgeeu',
                      isRequired: true,
                    },
                    {
                      name: 'application.extra.bucket_region',
                      label: 'New bucket region',
                      validate: [
                        {
                          type: 'required',
                        },
                      ],
                      component: 'text-field',
                      placeholder: 'uk-london-1',
                      isRequired: true,
                    },
                  ],
                },
              ],
              name: 'oci-cm-create-bucket',
              nextStep: 'oci-cm-populate-bucket',
            },
            {
              title: <FormattedMessage id="wizard.reviewDetails" defaultMessage="Populate bucket" />,
              showTitle: false,
              fields: [
                {
                  component: 'description',
                  name: 'description-summary',
                  Content: CMOci.PopulateBucket,
                },
              ],
              name: 'oci-cm-populate-bucket',
            },
          ],
          customSteps: true,
        },
      },
    },
  },
};

export default hardcodedSchemas;
