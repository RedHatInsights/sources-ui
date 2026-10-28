const HELP_TEXT_ARIA = 'Help text';

import React from 'react';
import { FormattedMessage, defineMessages } from 'react-intl';
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

const messages = defineMessages({
  helpTextAria: {
    id: 'wizard.helpTextAria',
    defaultMessage: 'Help text',
  },

  wizardArnpattern: {
    id: 'wizard.arnPattern',
    defaultMessage: 'ARN must start with arn:aws:',
  },
  wizardArnlength: {
    id: 'wizard.arnLength',
    defaultMessage: 'ARN should have at least 10 characters',
  },
  costArnS3bucketpattern: {
    id: 'cost.arn.s3BucketPattern',
    defaultMessage:
      'S3 bucket name must start with alphanumeric character and can contain lowercase letters, numbers, dots, and hyphens',
  },
  costArnStoragetitle: {
    id: 'cost.arn.storageTitle',
    defaultMessage: 'Create storage',
  },
  costArnS3label: {
    id: 'cost.arn.s3Label',
    defaultMessage: 'S3 bucket name',
  },
  costArnAwsregion: {
    id: 'cost.arn.awsRegion',
    defaultMessage: 'AWS region',
  },
  costArnUsagedescriptiontitle: {
    id: 'cost.arn.usageDescriptionTitle',
    defaultMessage: 'Create cost and usage report',
  },
  costArnSenddefaultcur: {
    id: 'cost.arn.sendDefaultCUR',
    defaultMessage: 'I am OK with sending the default data export to Cost Management',
  },
  costArnCustomizecur: {
    id: 'cost.arn.customizeCUR',
    defaultMessage: 'I wish to manually customize the data export sent to Cost Management',
  },
  costArnHelpcustomizecur: {
    id: 'cost.arn.helpCustomizeCUR',
    defaultMessage:
      'There will be a set of instructions at the end of this wizard that will guide you on how to complete the customize configuration that will be completed in the AWS console.',
  },
  costArnTagssteptitle: {
    id: 'cost.arn.tagsStepTitle',
    defaultMessage: 'Tags, aliases and organizational units',
  },
  costArnIncludesrhelusage: {
    id: 'cost.arn.includesRhelUsage',
    defaultMessage: 'Include RHEL usage',
  },
  costTagsAliasessorgunits: {
    id: 'cost.tags.aliasessOrgUnits',
    defaultMessage:
      'To use account aliases and organizational units in the display and filter of AWS resources, select the following',
  },
  costArnIncludesaliases: {
    id: 'cost.arn.includesAliases',
    defaultMessage: 'Include AWS account aliases',
  },
  costArnIncludeorgunits: {
    id: 'cost.arn.includeOrgUnits',
    defaultMessage: 'Include AWS organizational units',
  },
  costArnIampolicytitle: {
    id: 'cost.arn.iamPolicyTitle',
    defaultMessage: 'Create IAM policy',
  },
  costArnEnableaccountaccess: {
    id: 'cost.arn.enableAccountAccess',
    defaultMessage: 'Enable account access',
  },
  costArnIamrolesteptitle: {
    id: 'cost.arn.iamRoleStepTitle',
    defaultMessage: 'Create IAM role',
  },
  costArnEnterarn: {
    id: 'cost.arn.enterArn',
    defaultMessage: 'Enter ARN',
  },
  wizardArn: {
    id: 'wizard.arn',
    defaultMessage: 'ARN',
  },
  catalogUrlpatternmessage: {
    id: 'catalog.urlPatternMessage',
    defaultMessage: 'URL must start with https:// or http://',
  },
  catalogHostnamehelper: {
    id: 'catalog.hostnameHelper',
    defaultMessage: 'For example, https://myansibleinstance.example.com/ or https://127.0.0.1/',
  },
  wizardHostname: {
    id: 'wizard.hostname',
    defaultMessage: 'Hostname',
  },
  costIbmEnterpriseidtitle: {
    id: 'cost.ibm.enterpriseIdTitle',
    defaultMessage: 'Add enterprise ID',
  },
  costIbmSubsteptitle: {
    id: 'cost.ibm.substepTitle',
    defaultMessage: 'Enter account IDs',
  },
  costIbmAccountidtitle: {
    id: 'cost.ibm.accountIdTitle',
    defaultMessage: 'Add account ID',
  },
  costIbmServiceidtitle: {
    id: 'cost.ibm.serviceIdTitle',
    defaultMessage: 'Create a service ID',
  },
  costIbmAccessid: {
    id: 'cost.ibm.accessId',
    defaultMessage: 'Configure service ID access',
  },
  costIbmApikeytitle: {
    id: 'cost.ibm.apiKeyTitle',
    defaultMessage: 'Create an API key',
  },
  wizardClusterid: {
    id: 'wizard.clusterId',
    defaultMessage: 'Cluster Identifier',
  },
  wizardClusteridpattern: {
    id: 'wizard.clusterIdPattern',
    defaultMessage: 'Cluster ID must start with alphanumeric character and can contain underscore and hyphen',
  },
  costConfigureoperator: {
    id: 'cost.configureOperator',
    defaultMessage: 'Install and configure operator',
  },
  wizardUrlpatternmessage: {
    id: 'wizard.urlPatternMessage',
    defaultMessage: 'The URL is not formatted correctly.',
  },
  azureGenericUsername: {
    id: 'azure.generic.username',
    defaultMessage: 'App ID',
  },
  subwatchAzureTokentitle: {
    id: 'subwatch.azure.tokenTitle',
    defaultMessage: 'Obtain offline token',
  },
  subwatchAzureSubsteptitle: {
    id: 'subwatch.azure.substepTitle',
    defaultMessage: 'Enable account access',
  },
  subwatchAzurePlaybooktitle: {
    id: 'subwatch.azure.playbookTitle',
    defaultMessage: 'Run Ansible playbook',
  },
  subwatchLighthouseTitle: {
    id: 'subwatch.lighthouse.title',
    defaultMessage: 'Configure Azure Lighthouse',
  },
  subwatchLighthouseSubscriptionid: {
    id: 'subwatch.lighthouse.subscriptionId',
    defaultMessage: 'Set subscription ID',
  },
  costSubidpattern: {
    id: 'cost.subidPattern',
    defaultMessage: 'Subscription ID must start with alphanumeric character and can contain underscore and hyphen',
  },
  costResourcegrouppattern: {
    id: 'cost.resourceGroupPattern',
    defaultMessage: 'Resource group must start with alphanumeric character and can contain underscore and hyphen',
  },
  costStorageaccountpattern: {
    id: 'cost.storageAccountPattern',
    defaultMessage: 'Storage account must start with alphanumeric character and can contain underscore and hyphen',
  },
  costScopepattern: {
    id: 'cost.scopePattern',
    defaultMessage:
      'Cost export scope must start with alphanumeric character and can contain underscore, hyphen, and foward slash',
  },
  costExportnamepattern: {
    id: 'cost.exportNamePattern',
    defaultMessage: 'Cost export name must start with alphanumeric character and can contain underscore and hyphen',
  },
  costClientsecret: {
    id: 'cost.clientSecret',
    defaultMessage: 'Client secret',
  },
  costClientappid: {
    id: 'cost.clientAppId',
    defaultMessage: 'Client (Application) ID',
  },
  costTenantdirid: {
    id: 'cost.tenantDirId',
    defaultMessage: 'Tenant (Directory) ID',
  },
  costCreatedailyexport: {
    id: 'cost.createDailyExport',
    defaultMessage: 'Specify cost export scope',
  },
  costSenddefaultcostexport: {
    id: 'cost.sendDefaultCostExport',
    defaultMessage: 'I am OK with sending the default data set to Cost Management',
  },
  costCustomizecostexport: {
    id: 'cost.customizeCostExport',
    defaultMessage: 'I wish to manually customize the data set sent to Cost Management',
  },
  costAzureIncludesrhelusage: {
    id: 'cost.azure.includesRhelUsage',
    defaultMessage: 'Include RHEL usage',
  },
  wizardCostexportscope: {
    id: 'wizard.costExportScope',
    defaultMessage: 'Cost export scope',
  },
  wizardCostexportname: {
    id: 'wizard.costExportName',
    defaultMessage: 'Cost export name',
  },
  costAzuresubstepid: {
    id: 'cost.azureSubStepId',
    defaultMessage: 'Resource group and storage account',
  },
  wizardResourcegroupname: {
    id: 'wizard.resourceGroupName',
    defaultMessage: 'Resource group name',
  },
  wizardStorageaccountname: {
    id: 'wizard.storageAccountName',
    defaultMessage: 'Storage account name',
  },
  wizardSubscriptionid: {
    id: 'wizard.subscriptionId',
    defaultMessage: 'Subscription ID',
  },
  wizardConfigureroles: {
    id: 'wizard.configureRoles',
    defaultMessage: 'Roles',
  },
  provisioningLighthouseTitle: {
    id: 'provisioning.lighthouse.title',
    defaultMessage: 'Configure Azure Lighthouse',
  },
  provisioningLighthouseSubscriptionid: {
    id: 'provisioning.lighthouse.subscriptionId',
    defaultMessage: 'Set subscription ID',
  },
  provisioningSubscriptionidpattern: {
    id: 'provisioning.subscriptionIdPattern',
    defaultMessage: 'Subscription ID must only contain alphanumeric characters and hyphens',
  },
  wizardAccountid: {
    id: 'wizard.accountId',
    defaultMessage: 'Account ID',
  },
  imageBuilderAwsAccountIdAccountidpatter: {
    id: 'image-builder-aws-account-id.accountIdPatter',
    defaultMessage: 'Account Id has to be 12 numbers',
  },
  wizardAccesskeyid: {
    id: 'wizard.accessKeyId',
    defaultMessage: 'Access key ID',
  },
  wizardSecretaccesskey: {
    id: 'wizard.secretAccessKey',
    defaultMessage: 'Secret access key',
  },
  wizardConfigureaccountaccess: {
    id: 'wizard.configureAccountAccess',
    defaultMessage: 'Account access',
  },
  cloudmeterCreateiampolicy: {
    id: 'cloudmeter.createIamPolicy',
    defaultMessage: 'Create IAM policy',
  },
  cloudmeterEnableaccountaccess: {
    id: 'cloudmeter.enableAccountAccess',
    defaultMessage: 'Enable account access',
  },
  cloudmeterCreateiamrole: {
    id: 'cloudmeter.createIamRole',
    defaultMessage: 'Create IAM role',
  },
  cloudmeterEnterarn: {
    id: 'cloudmeter.enterArn',
    defaultMessage: 'Enter ARN',
  },
  provisioningCreateiampolicy: {
    id: 'provisioning.createIamPolicy',
    defaultMessage: 'AWS Account Number',
  },
  provisioningEnableaccountaccess: {
    id: 'provisioning.enableAccountAccess',
    defaultMessage: 'Enable account access',
  },
  provisioningCreateiamrole: {
    id: 'provisioning.createIamRole',
    defaultMessage: 'Create IAM role',
  },
  provisioningEnterarn: {
    id: 'provisioning.enterArn',
    defaultMessage: 'Enter ARN',
  },
  satelliteSatelliteid: {
    id: 'satellite.satelliteId',
    defaultMessage: 'Satellite ID',
  },
  satelliteReceptorid: {
    id: 'satellite.receptorId',
    defaultMessage: 'Receptor ID',
  },
  satelliteCredentials: {
    id: 'satellite.credentials',
    defaultMessage: 'Credentials',
  },
  wizardUsername: {
    id: 'wizard.username',
    defaultMessage: 'Username',
  },
  wizardPassword: {
    id: 'wizard.password',
    defaultMessage: 'Password',
  },
  wizardCertificateauthoriy: {
    id: 'wizard.certificateAuthoriy',
    defaultMessage: 'Certificate authority',
  },
  wizardVerifyssl: {
    id: 'wizard.verifySsl',
    defaultMessage: 'Verify TLS',
  },
  wizardCredentials: {
    id: 'wizard.credentials',
    defaultMessage: 'Credentials',
  },
  catalogAnsibletowerendpoint: {
    id: 'catalog.ansibleTowerEndpoint',
    defaultMessage: 'Ansible Tower endpoint',
  },
  wizardCertificateauthority: {
    id: 'wizard.certificateAuthority',
    defaultMessage: 'Certificate authority',
  },
  provisioningEnterprojectid: {
    id: 'provisioning.enterProjectID',
    defaultMessage: 'Enter Project ID',
  },
  provisioningCreaterole: {
    id: 'provisioning.createRole',
    defaultMessage: 'Create custom role',
  },
  costGcpProjecttitle: {
    id: 'cost.gcp.projectTitle',
    defaultMessage: 'Project',
  },
  costGcpSenddefaultcur: {
    id: 'cost.gcp.sendDefaultCUR',
    defaultMessage: 'I am OK with sending the default dataset to Cost Management',
  },
  costGcpCustomizecur: {
    id: 'cost.gcp.customizeCUR',
    defaultMessage: 'I wish to manually customize the dataset sent to Cost Management',
  },
  costGcpCloudstorage: {
    id: 'cost.gcp.cloudStorage',
    defaultMessage: 'Create cloud storage bucket',
  },
  costGcpIamtitle: {
    id: 'cost.gcp.iamTitle',
    defaultMessage: 'Create IAM role',
  },
  costGcpAccesstitle: {
    id: 'cost.gcp.accessTitle',
    defaultMessage: 'Assign access',
  },
  costGcpDatasettitle: {
    id: 'cost.gcp.datasetTitle',
    defaultMessage: 'Create dataset',
  },
  costGcpBillingexporttitle: {
    id: 'cost.gcp.billingExportTitle',
    defaultMessage: 'Billing export',
  },
});

const arnMessagePattern = <FormattedMessage {...messages.wizardArnpattern} />;
const arnMessageLength = <FormattedMessage {...messages.wizardArnlength} />;

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
        message: <FormattedMessage {...messages.costArnS3bucketpattern} />,
      },
    ],
    isRequired: true,
  },
  additionalSteps: [
    {
      title: <FormattedMessage {...messages.costArnStoragetitle} />,
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
          label: <FormattedMessage {...messages.costArnS3label} />,
        },
        {
          name: 'application.extra.bucket_region',
          component: componentTypes.SELECT,
          loadOptions: () => doLoadRegions().then((data) => data.map((item) => ({ value: item, label: item }))),
          label: <FormattedMessage {...messages.costArnAwsregion} />,
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
      title: <FormattedMessage {...messages.costArnUsagedescriptiontitle} />,
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
              label: <FormattedMessage {...messages.costArnSenddefaultcur} />,
              value: false,
            },
            {
              label: (
                <span>
                  <FormattedMessage {...messages.costArnCustomizecur} />{' '}
                  <Popover
                    aria-label={HELP_TEXT_ARIA}
                    position="right"
                    maxWidth="5%"
                    bodyContent={<FormattedMessage {...messages.costArnHelpcustomizecur} />}
                  >
                    <Button
                      icon={<QuestionCircleIcon className="pf-v6-u-ml-sm" />}
                      className="pf-v6-u-p-0 pf-v6-u-m-0"
                      variant={ButtonVariant.plain}
                    />
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
      title: <FormattedMessage {...messages.costArnTagssteptitle} />,
      name: 'tags',
      nextStep: 'iam-policy',
      fields: [
        {
          name: 'tags-description',
          component: 'description',
          Content: () => <AwsArn.TagsDescription showHCS={showHCS} />,
        },
        {
          name: 'application.extra.metered',
          component: 'rhel-usage-checkbox',
          label: <FormattedMessage {...messages.costArnIncludesrhelusage} />,
        },
        {
          name: 'aws.rhel_usage.divider',
          component: 'divider',
        },
        {
          name: 'cost.tags.aliasessOrgUnits',
          component: 'plain-text',
          label: <FormattedMessage {...messages.costTagsAliasessorgunits} />,
        },
        {
          name: 'aws.aliases.enabled',
          component: 'checkbox-with-icon',
          label: <FormattedMessage {...messages.costArnIncludesaliases} />,
          Icon: AwsArn.IncludeAliasesLabel,
        },
        {
          name: 'aws.org_units.enabled',
          component: 'checkbox-with-icon',
          label: <FormattedMessage {...messages.costArnIncludeorgunits} />,
          Icon: AwsArn.IncludeOrgUnitsLabel,
        },
      ],
    },
    {
      title: <FormattedMessage {...messages.costArnIampolicytitle} />,
      name: 'iam-policy',
      nextStep: 'iam-role',
      substepOf: {
        name: 'eaa',
        title: <FormattedMessage {...messages.costArnEnableaccountaccess} />,
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
      title: <FormattedMessage {...messages.costArnIamrolesteptitle} />,
      name: 'iam-role',
      nextStep: 'arn',
      substepOf: 'eaa',
      fields: [
        {
          name: 'authentication.extra.external_id',
          component: componentTypes.TEXT_FIELD,
          hideField: true,
          initializeOnMount: true,
        },
        {
          name: 'iam-role-description',
          component: 'description',
          Content: AwsArn.IAMRoleDescription,
        },
      ],
    },
    {
      title: <FormattedMessage {...messages.costArnEnterarn} />,
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
  label: <FormattedMessage {...messages.wizardArn} />,
};

const ansibleTowerURL = {
  isRequired: true,
  validate: [
    { type: validatorTypes.REQUIRED },
    {
      type: validatorTypes.PATTERN,
      message: <FormattedMessage {...messages.catalogUrlpatternmessage} />,
      pattern: /^https{0,1}:\/\//,
    },
    { type: validatorTypes.URL },
  ],
  helperText: (
    <FormHelperText isHidden={false}>
      <FormattedMessage {...messages.catalogHostnamehelper} />
    </FormHelperText>
  ),
  label: <FormattedMessage {...messages.wizardHostname} />,
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
              title: <FormattedMessage {...messages.costIbmEnterpriseidtitle} />,
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
                title: <FormattedMessage {...messages.costIbmSubsteptitle} />,
              },
            },
            {
              title: <FormattedMessage {...messages.costIbmAccountidtitle} />,
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
              title: <FormattedMessage {...messages.costIbmServiceidtitle} />,
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
              title: <FormattedMessage {...messages.costIbmAccessid} />,
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
              title: <FormattedMessage {...messages.costIbmApikeytitle} />,
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
            label: <FormattedMessage {...messages.wizardClusterid} />,
            isRequired: true,
            component: componentTypes.TEXT_FIELD,
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
              {
                type: validatorTypes.PATTERN,
                pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                message: <FormattedMessage {...messages.wizardClusteridpattern} />,
              },
            ],
          },
          additionalSteps: [
            {
              title: <FormattedMessage {...messages.costConfigureoperator} />,
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
            message: <FormattedMessage {...messages.wizardUrlpatternmessage} />,
          },
        ],
      },
      'endpoint.certificate_authority': {
        label: <SSLFormLabel />,
        'aria-label': 'TLS Certificate',
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
            label: <FormattedMessage {...messages.azureGenericUsername} />,
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
              title: <FormattedMessage {...messages.subwatchAzureTokentitle} />,
              nextStep: 'cost-azure-playbook',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage {...messages.subwatchAzureSubsteptitle} />,
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
              title: <FormattedMessage {...messages.subwatchAzurePlaybooktitle} />,
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
              title: <FormattedMessage {...messages.subwatchLighthouseTitle} />,
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
              title: <FormattedMessage {...messages.subwatchLighthouseSubscriptionid} />,
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
                message: <FormattedMessage {...messages.costSubidpattern} />,
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
                message: <FormattedMessage {...messages.costResourcegrouppattern} />,
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
                message: <FormattedMessage {...messages.costStorageaccountpattern} />,
              },
            ],
          },
          'application.extra.scope': {
            placeholder: '',
            validate: [
              {
                type: validatorTypes.PATTERN,
                pattern: /^[\/A-Za-z0-9]+[\.\/\:A-Za-z0-9_-]*$/, // eslint-disable-line no-useless-escape
                message: <FormattedMessage {...messages.costScopepattern} />,
              },
            ],
          },
          'application.extra.export_name': {
            placeholder: '',
            validate: [
              {
                type: validatorTypes.PATTERN,
                pattern: /^[A-Za-z0-9]+[A-Za-z0-9_-]*$/,
                message: <FormattedMessage {...messages.costExportnamepattern} />,
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
            label: <FormattedMessage {...messages.costClientsecret} />,
          },
          'authentication.username': {
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
            ],
            label: <FormattedMessage {...messages.costClientappid} />,
          },
          'authentication.extra.azure.tenant_id': {
            label: <FormattedMessage {...messages.costTenantdirid} />,
            validate: [
              {
                type: validatorTypes.REQUIRED,
              },
            ],
          },
          additionalSteps: [
            {
              title: <FormattedMessage {...messages.costCreatedailyexport} />,
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
                      label: <FormattedMessage {...messages.costSenddefaultcostexport} />,
                      value: false,
                    },
                    {
                      label: <FormattedMessage {...messages.costCustomizecostexport} />,
                      value: true,
                    },
                  ],
                  mutator: (option) => option,
                  initialValue: false,
                  hideInReview: true,
                },
                {
                  name: 'cost-export-scope-rhel-alert',
                  component: 'description',
                  Content: CMAzure.ExportScopeAlert,
                },
                {
                  name: 'application.extra.metered',
                  component: 'rhel-usage-checkbox',
                  label: <FormattedMessage {...messages.costAzureIncludesrhelusage} />,
                },
                {
                  name: 'azure.rhel_usage.divider',
                  component: 'divider',
                },
                {
                  name: 'cost-export-scope',
                  component: 'description',
                  Content: CMAzure.ExportScope,
                },
                {
                  name: 'application.extra.scope',
                  component: componentTypes.TEXT_FIELD,
                  label: <FormattedMessage {...messages.wizardCostexportscope} />,
                  condition: { when: 'application.extra.storage_only', is: false },
                },
              ],
            },
            {
              title: <FormattedMessage {...messages.costCreatedailyexport} />,
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
                  label: <FormattedMessage {...messages.wizardCostexportname} />,
                  condition: { when: 'application.extra.storage_only', is: false },
                },
              ],
            },
            {
              title: <FormattedMessage {...messages.costAzuresubstepid} />,
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
                  label: <FormattedMessage {...messages.wizardResourcegroupname} />,
                },
                {
                  name: 'application.extra.storage_account',
                  component: componentTypes.TEXT_FIELD,
                  label: <FormattedMessage {...messages.wizardStorageaccountname} />,
                },
              ],
            },
            {
              title: <FormattedMessage {...messages.wizardSubscriptionid} />,
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
                  label: <FormattedMessage {...messages.wizardSubscriptionid} />,
                },
              ],
            },
            {
              title: <FormattedMessage {...messages.wizardConfigureroles} />,
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
              title: <FormattedMessage {...messages.provisioningLighthouseTitle} />,
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
              title: <FormattedMessage {...messages.provisioningLighthouseSubscriptionid} />,
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
                  validate: [
                    {
                      type: validatorTypes.PATTERN,
                      pattern: /^[A-Za-z0-9-]+$/,
                      message: <FormattedMessage {...messages.provisioningSubscriptionidpattern} />,
                    },
                    { type: 'required' },
                  ],
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
      'image-builder-aws-account-id': {
        generic: {
          'authentication.username': {
            label: <FormattedMessage {...messages.wizardAccountid} />,
            placeholder: '123456789012',
            isRequired: true,
            pattern: '[0-9]{12}',
            maxlength: 12,
            type: 'number',
            validate: [
              { type: validatorTypes.REQUIRED },
              {
                type: validatorTypes.PATTERN,
                pattern: /^\d{12}$/,
                message: <FormattedMessage {...messages.imageBuilderAwsAccountIdAccountidpatter} />,
              },
            ],
          },
        },
      },
      access_key_secret_key: {
        generic: {
          'authentication.username': {
            label: <FormattedMessage {...messages.wizardAccesskeyid} />,
            placeholder: 'AKIAIOSFODNN7EXAMPLE',
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
          },
          'authentication.password': {
            label: <FormattedMessage {...messages.wizardSecretaccesskey} />,
            placeholder: 'wJairXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
            isRequired: true,
            validate: [{ type: validatorTypes.REQUIRED }],
            type: 'password',
          },
          skipSelection: true,
          onlyHiddenFields: true,
          additionalSteps: [
            {
              title: <FormattedMessage {...messages.wizardConfigureaccountaccess} />,
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
              title: <FormattedMessage {...messages.cloudmeterCreateiampolicy} />,
              nextStep: 'subs-iam-role',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage {...messages.cloudmeterEnableaccountaccess} />,
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
              title: <FormattedMessage {...messages.cloudmeterCreateiamrole} />,
              name: 'subs-iam-role',
              nextStep: 'subs-arn',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'authentication.extra.external_id',
                  component: componentTypes.TEXT_FIELD,
                  hideField: true,
                  initializeOnMount: true,
                },
                {
                  name: 'iam-role-description',
                  component: 'description',
                  Content: SWAwsArn.IAMRoleDescription,
                },
              ],
            },
            {
              title: <FormattedMessage {...messages.cloudmeterEnterarn} />,
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
              title: <FormattedMessage {...messages.provisioningCreateiampolicy} />,
              nextStep: 'prov-iam-role',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage {...messages.provisioningEnableaccountaccess} />,
              },
              fields: [
                {
                  name: 'iam-policy-description',
                  component: 'description',
                  Content: ProvAwsArn.AccountNumber,
                },
                {
                  component: componentTypes.TEXT_FIELD,
                  name: 'meta.account',
                  isRequired: true,
                  label: 'Account number',
                  placeholder: '123456789',
                  validate: [{ type: 'required' }],
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
              title: <FormattedMessage {...messages.provisioningCreateiamrole} />,
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
              title: <FormattedMessage {...messages.provisioningEnterarn} />,
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
            label: <FormattedMessage {...messages.satelliteSatelliteid} />,
            validate: [{ type: validatorTypes.REQUIRED }],
            component: componentTypes.TEXT_FIELD,
          },
          'endpoint.receptor_node': {
            label: <FormattedMessage {...messages.satelliteReceptorid} />,
            validate: [{ type: validatorTypes.REQUIRED }],
            component: componentTypes.TEXT_FIELD,
          },
          skipSelection: true,
          onlyHiddenFields: true,
          customSteps: true,
          additionalSteps: [
            {
              title: <FormattedMessage {...messages.satelliteCredentials} />,
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
            label: <FormattedMessage {...messages.wizardUsername} />,
          },
          'authentication.password': {
            type: 'password',
            isRequired: false,
            validate: [{ type: validatorTypes.REQUIRED }],
            label: <FormattedMessage {...messages.wizardPassword} />,
          },
          url: ansibleTowerURL,
          'endpoint.certificate_authority': {
            label: <FormattedMessage {...messages.wizardCertificateauthoriy} />,
          },
          'endpoint.verify_ssl': {
            initialValue: false,
            label: <FormattedMessage {...messages.wizardVerifyssl} />,
          },
          additionalSteps: [
            {
              title: <FormattedMessage {...messages.wizardCredentials} />,
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
              title: <FormattedMessage {...messages.catalogAnsibletowerendpoint} />,
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
            label: <FormattedMessage {...messages.wizardUsername} />,
          },
          'authentication.password': {
            type: 'password',
            isRequired: false,
            validate: [{ type: validatorTypes.REQUIRED }],
            label: <FormattedMessage {...messages.wizardPassword} />,
          },
          url: ansibleTowerURL,
          'endpoint.certificate_authority': {
            label: <FormattedMessage {...messages.wizardCertificateauthoriy} />,
          },
          'endpoint.verify_ssl': {
            initialValue: false,
            label: <FormattedMessage {...messages.wizardVerifyssl} />,
          },
          additionalSteps: [
            {
              nextStep: 'catalog-ansible-tower',
              title: <FormattedMessage {...messages.catalogAnsibletowerendpoint} />,
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
              title: <FormattedMessage {...messages.wizardCredentials} />,
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
        label: <FormattedMessage {...messages.wizardCertificateauthority} />,
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
              title: <FormattedMessage {...messages.subwatchAzureTokentitle} />,
              nextStep: 'cost-google-playbook',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage {...messages.subwatchAzureSubsteptitle} />,
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
              title: <FormattedMessage {...messages.subwatchAzurePlaybooktitle} />,
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
              title: <FormattedMessage {...messages.provisioningEnterprojectid} />,
              nextStep: 'prov-custom-role',
              substepOf: {
                name: 'eaa',
                title: <FormattedMessage {...messages.provisioningEnableaccountaccess} />,
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
              title: <FormattedMessage {...messages.provisioningCreaterole} />,
              name: 'prov-custom-role',
              substepOf: 'eaa',
              fields: [
                {
                  name: 'custom-role-description',
                  component: 'description',
                  Content: ProvGCP.ConnectGCP,
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
              title: <FormattedMessage {...messages.costGcpProjecttitle} />,
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
                      label: <FormattedMessage {...messages.costGcpSenddefaultcur} />,
                      value: false,
                    },
                    {
                      label: (
                        <span>
                          <FormattedMessage {...messages.costGcpCustomizecur} />
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
              title: <FormattedMessage {...messages.costGcpCloudstorage} />,
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
              title: <FormattedMessage {...messages.costGcpIamtitle} />,
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
                title: <FormattedMessage {...messages.costArnEnableaccountaccess} />,
              },
            },
            {
              title: <FormattedMessage {...messages.costGcpAccesstitle} />,
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
              title: <FormattedMessage {...messages.costGcpDatasettitle} />,
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
              title: <FormattedMessage {...messages.costGcpBillingexporttitle} />,
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
};

export default hardcodedSchemas;
