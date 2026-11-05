import React, { Fragment, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { defineMessages, useIntl } from 'react-intl';
import { v4 as uuidv4 } from 'uuid';

import {
  Alert,
  Button,
  ButtonVariant,
  ClipboardCopy,
  ClipboardCopyVariant,
  Content,
  ContentVariants,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateVariant,
  Popover,
  Title,
} from '@patternfly/react-core';

import InfoCircleIcon from '@patternfly/react-icons/dist/esm/icons/info-circle-icon';
import QuestionCircleIcon from '@patternfly/react-icons/dist/esm/icons/question-circle-icon';

import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { HCCM_DOCS_PREFIX, HCCM_LATEST_DOCS_PREFIX, HCS_LATEST_DOCS_PREFIX } from '../../stringConstants';
import { HCS_APP_NAME } from '../../../../utilities/constants';
import { useFlag } from '@unleash/proxy-client-react';

const messages = defineMessages({
  helpTextAria: {
    id: 'arn.helpTextAria',
    defaultMessage: 'Help text',
  },
  costStoragedescriptionSpecifybucker: {
    id: 'cost.storageDescription.specifyBucker',
    defaultMessage: "On AWS, specify or create an Amazon S3 bucket for your account and enter it's name below.",
  },
  costUsagedescriptionUsagedescription: {
    id: 'cost.usageDescription.usageDescription',
    defaultMessage:
      "The information {application} would need is your AWS account's data export. If there is a need to further customize the data export you want to send to {application}, select the manually customize option and follow the special instructions on how to.",
  },
  costStoragedescriptionStoragedescription: {
    id: 'cost.storageDescription.storageDescription',
    defaultMessage:
      'To store the data export (previously called a cost and usage report) for cost management, create an Amazon S3 bucket. {link}',
  },
  costLearnmore: {
    id: 'cost.learnMore',
    defaultMessage: 'Learn more',
  },
  costUsagedescriptionManualtitlecur: {
    id: 'cost.usageDescription.manualTitleCUR',
    defaultMessage: 'Skip this step and proceed to next step',
  },
  costUsagedescriptionManualdescriptioncur: {
    id: 'cost.usageDescription.manualDescriptionCUR',
    defaultMessage:
      'Because you have chosen to manually customize the data set you want to send to cost management, you do not need to create a data export (previously called a cost and usage report).',
  },
  costUsagedescriptionAdditionalstepscur: {
    id: 'cost.usageDescription.additionalStepsCUR',
    defaultMessage: 'Additional configuration steps',
  },
  costUsagedescriptionAddfollowingvalues: {
    id: 'cost.usageDescription.addFollowingValues',
    defaultMessage: 'Create a data export using the following values:',
  },
  costUsagedescriptionExporttype: {
    id: 'cost.usageDescription.exportType',
    defaultMessage: 'Export type: Legacy CUR export',
  },
  costUsagedescriptionExportname: {
    id: 'cost.usageDescription.exportName',
    defaultMessage: 'Export name: koku',
  },
  costUsagedescriptionIncludesresourceids: {
    id: 'cost.usageDescription.includesResourceIDs',
    defaultMessage: 'Include: Resource IDs',
  },
  costUsagedescriptionDatarefreshsettings: {
    id: 'cost.usageDescription.dataRefreshSettings',
    defaultMessage: 'Enable: Refresh automatically',
  },
  costUsagedescriptionTimeunithourly: {
    id: 'cost.usageDescription.timeUnitHourly',
    defaultMessage: 'Time unit: hourly',
  },
  costUsagedescriptionEnablesupport: {
    id: 'cost.usageDescription.enableSupport',
    defaultMessage: 'Enable support for: RedShift, QuickSight and disable support for Athena',
  },
  costUsagedescriptionCompression: {
    id: 'cost.usageDescription.compression',
    defaultMessage: 'Compression type: GZIP',
  },
  costUsagedescriptionReportbucket: {
    id: 'cost.usageDescription.reportBucket',
    defaultMessage: 'Report path prefix: cost',
  },
  costIamroleCreateiamrole: {
    id: 'cost.iamrole.createIamRole',
    defaultMessage: 'To delegate account access, create an IAM role to associate with your IAM policy.',
  },
  costIamroleCreatenewrole: {
    id: 'cost.iamrole.createNewRole',
    defaultMessage: 'From the AWS Identity Access Management console, create a new role.',
  },
  costIamroleEnteraccountid: {
    id: 'cost.iamrole.enterAccountId',
    defaultMessage:
      'Select another AWS account from the list of trusted entities and paste the following value into the Account ID field:',
  },
  costIamroleEnterexternalid: {
    id: 'cost.iamrole.enterExternalId',
    defaultMessage: 'Paste the following value in the External ID field:',
  },
  costIamroleAttachpolicy: {
    id: 'cost.iamrole.attachPolicy',
    defaultMessage: 'Attach the permissions policy that you just created.',
  },
  costIamroleCompleteproccess: {
    id: 'cost.iamrole.completeProccess',
    defaultMessage: 'Complete the process to create your new role.',
  },
  costIampolicySomethingwrong: {
    id: 'cost.iampolicy.somethingWrong',
    defaultMessage: 'Something went wrong, you are missing bucket value.',
  },
  costIampolicyGrantpermissions: {
    id: 'cost.iampolicy.grantPermissions',
    defaultMessage:
      'To grant permissions to the cost management report you just configured, create an AWS Identity and Access Management (IAM) policy. {link}',
  },
  wizardLearnmore: {
    id: 'wizard.learnMore',
    defaultMessage: 'Learn more',
  },
  costIampolicySigniniamconsole: {
    id: 'cost.iampolicy.signInIAMConsole',
    defaultMessage: 'Sign in to the AWS Identity and Access Management (IAM) console.',
  },
  costIampolicyCreatepolicy: {
    id: 'cost.iampolicy.createPolicy',
    defaultMessage: 'Create a new policy, pasting the following content into the JSON text box.',
  },
  costIampolicyCompleteproccess: {
    id: 'cost.iampolicy.completeProccess',
    defaultMessage: 'Complete the process to create your new policy.',
  },
  costIampolicyLoginiam: {
    id: 'cost.iampolicy.logInIam',
    defaultMessage: '{bold} You will need to be logged in to the IAM console to complete the next step.',
  },
  costDonotcloseyourbrowser: {
    id: 'cost.DoNotCloseYourBrowser',
    defaultMessage: 'Do not close your browser.',
  },
  costTagsReadmelink: {
    id: 'cost.tags.readMeLink',
    defaultMessage: 'Learn more',
  },
  costTagsDesciption: {
    id: 'cost.tags.desciption',
    defaultMessage:
      'To use tags to organize your AWS resources in the {applicationName} application, activate your tags in AWS to allow them to be imported automatically.',
  },
  costTagsOpensection: {
    id: 'cost.tags.openSection',
    defaultMessage: 'In the AWS Billing and Cost Management console, open the Cost Allocation Tags section.',
  },
  costTagsSelecttags: {
    id: 'cost.tags.selectTags',
    defaultMessage: 'Select the tags you want to use in the {applicationName} application, and click Activate.',
  },
  costTagsAlerttitle: {
    id: 'cost.tags.alertTitle',
    defaultMessage:
      'If your organization is converting systems from CentOS 7 to RHEL and using hourly billing, activate the com_redhat_rhel tag for your systems in the Cost Allocation Tags section of the AWS console. After activating the tag in AWS, select Include RHEL usage.',
  },
  costArnEnableaccess: {
    id: 'cost.arn.enableAccess',
    defaultMessage: 'To enable account access, capture the ARN associated with the role you just created.',
  },
  costArnSelectrole: {
    id: 'cost.arn.selectRole',
    defaultMessage: 'From the Roles tab, select the role you just created.',
  },
  costArnCopyarn: {
    id: 'cost.arn.copyArn',
    defaultMessage: 'From the Summary screen, copy the role ARN and paste it in the ARN field:',
  },
  costArnIncludealiasespopover: {
    id: 'cost.arn.includeAliasesPopover',
    defaultMessage:
      'If there are account aliases, they will appear and be used for filtering when reporting on AWS accounts. This will include "iam:ListAccountAliases" to the Action of the IAM Policy.',
  },
  costArnIncludeorgunitspopover: {
    id: 'cost.arn.includeOrgUnitsPopover',
    defaultMessage:
      'If there are organizational units, they will be used for filtering when reporting on AWS resources. This will include "organizations:List*" and "organizations:Describe*" to the Action of the IAM Policy',
  },
});

const CREATE_HCS_S3_BUCKET = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_amazon_web_services_aws_data_into_hybrid_committed_spend/assembly-adding-aws-int-hcs#creating-an-aws-s3-bucket-hcs-n_adding-aws-int-hcs`;
const CREATE_S3_BUCKET = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_filtered_aws_int#creating-an-aws-s3-bucket-hcs-n`;
const ENABLE_AWS_ACCOUNT = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_filtered_aws_int#enabling-aws-account-access`;
const ENABLE_HCS_AWS_ACCOUNT = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_amazon_web_services_aws_data_into_hybrid_committed_spend/assembly-adding-aws-int-hcs#enabling-aws-account-access_adding-aws-int-hcs`;
const CONFIG_AWS_TAGS = `${HCCM_DOCS_PREFIX}/html/integrating_amazon_web_services_aws_data_into_cost_management/assembly-cost-management-next-steps-aws#configure-cost-models-next-step_next-steps-aws`;
const RHEL_METERED_AWS = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_filtered_aws_int#activating-aws-tags`;
const CONFIG_HCS_AWS_TAGS = ''; // specify when HCS docs links are available

const STG_AWS_ACCOUNT_ID = '148761653619';
const PROD_AWS_ACCOUNT_ID = '589173575009';

const buildIamPolicy = (s3Bucket, aliasesEnabled, orgUnitsEnabled) => ({
  Version: '2012-10-17',
  Statement: [
    {
      Sid: 'VisualEditor0',
      Effect: 'Allow',
      Action: ['s3:Get*', 's3:List*'],
      Resource: [`arn:aws:s3:::${s3Bucket}`, `arn:aws:s3:::${s3Bucket}/*`],
    },
    {
      Sid: 'VisualEditor1',
      Effect: 'Allow',
      Action: [
        's3:ListBucket',
        'cur:DescribeReportDefinitions',
        ...(aliasesEnabled ? ['iam:ListAccountAliases'] : []),
        ...(orgUnitsEnabled ? ['organizations:List*', 'organizations:Describe*'] : []),
      ],
      Resource: '*',
    },
  ],
});

export const MANUAL_CUR_STEPS = `${HCCM_LATEST_DOCS_PREFIX}/integrate-adding_filtered_aws_int`;

export const StorageDescription = ({ showHCS }) => {
  const intl = useIntl();
  return (
    <Content>
      <Content component="p">
        {intl.formatMessage(messages.costStoragedescriptionStoragedescription, {
          link: showHCS ? null : ( // remove when HCS docs links are available
            <Fragment>
              <br />
              <Content
                key="link"
                component={ContentVariants.a}
                href={showHCS ? CREATE_HCS_S3_BUCKET : CREATE_S3_BUCKET}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage(messages.costLearnmore)}
              </Content>
            </Fragment>
          ),
        })}
      </Content>
      <Content className="pf-v6-u-ml-0" component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.costStoragedescriptionSpecifybucker)}</Content>
      </Content>
    </Content>
  );
};

StorageDescription.propTypes = {
  showHCS: PropTypes.bool,
};

export const UsageDescription = ({ showHCS }) => {
  const intl = useIntl();
  const application = showHCS ? HCS_APP_NAME : 'Cost Management';

  return (
    <Content>
      <Content component="p">
        {intl.formatMessage(messages.costUsagedescriptionUsagedescription, {
          application,
        })}
      </Content>
    </Content>
  );
};

UsageDescription.propTypes = {
  showHCS: PropTypes.bool,
};

export const UsageSteps = () => {
  const intl = useIntl();
  const formOptions = useFormApi();

  const application = formOptions.getState().values.application;

  return application.extra.storage_only ? (
    <EmptyState
      titleText={
        <Title size="lg" headingLevel="h4">
          {intl.formatMessage(messages.costUsagedescriptionManualtitlecur)}
        </Title>
      }
      icon={InfoCircleIcon}
      variant={EmptyStateVariant.small}
    >
      <EmptyStateBody>{intl.formatMessage(messages.costUsagedescriptionManualdescriptioncur)}</EmptyStateBody>
      <EmptyStateActions>
        <Content variant="link" component={ContentVariants.a} href={MANUAL_CUR_STEPS} rel="noopener noreferrer" target="_blank">
          {intl.formatMessage(messages.costUsagedescriptionAdditionalstepscur)}
        </Content>
      </EmptyStateActions>
    </EmptyState>
  ) : (
    <Content>
      <Content className="pf-v6-u-ml-0" component={ContentVariants.ol}>
        <Content component="li">
          {intl.formatMessage(messages.costUsagedescriptionAddfollowingvalues)}
          <Content component="ul">
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionExporttype)}</Content>
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionExportname)}</Content>
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionIncludesresourceids)}</Content>
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionDatarefreshsettings)}</Content>
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionTimeunithourly)}</Content>
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionEnablesupport)}</Content>
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionCompression)}</Content>
            <Content component="li">{intl.formatMessage(messages.costUsagedescriptionReportbucket)}</Content>
          </Content>
        </Content>
      </Content>
    </Content>
  );
};

export const IAMRoleDescription = () => {
  const intl = useIntl();
  const externalId = useMemo(() => uuidv4(), []);
  const formOptions = useFormApi();
  const { authentication = {} } = formOptions.getState().values;
  const isNewHccmStgAwsAccount = useFlag('platform.sources.integrations.new-hccm-stg-account');

  useEffect(() => {
    formOptions.change('authentication', {
      ...authentication,
      extra: { ...(authentication?.extra || {}), external_id: externalId },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  }, [externalId]);

  return (
    <Content>
      <Content component="p">{intl.formatMessage(messages.costIamroleCreateiamrole)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.costIamroleCreatenewrole)}</Content>
        <Content component="li">{intl.formatMessage(messages.costIamroleEnteraccountid)}</Content>
        <ClipboardCopy className="pf-v6-u-m-sm-on-sm" isReadOnly>
          {isNewHccmStgAwsAccount ? STG_AWS_ACCOUNT_ID : PROD_AWS_ACCOUNT_ID}
        </ClipboardCopy>
        <Content component="li">{intl.formatMessage(messages.costIamroleEnterexternalid)}</Content>
        <ClipboardCopy className="pf-v6-u-m-sm-on-sm" isReadOnly>
          {externalId}
        </ClipboardCopy>
        <Content component="li">{intl.formatMessage(messages.costIamroleAttachpolicy)}</Content>
        <Content component="li">{intl.formatMessage(messages.costIamroleCompleteproccess)}</Content>
      </Content>
    </Content>
  );
};

export const IAMPolicyDescription = ({ showHCS }) => {
  const formOptions = useFormApi();
  const intl = useIntl();

  const values = formOptions.getState().values;
  const s3Bucket = values.application?.extra?.bucket;
  const aliasesEnabled = values.aws?.aliases?.enabled;
  const orgUnitsEnabled = values.aws?.org_units?.enabled;

  if (!s3Bucket) {
    return <Content component="p">{intl.formatMessage(messages.costIampolicySomethingwrong)}</Content>;
  }

  return (
    <Content>
      <Content component="p">
        {intl.formatMessage(messages.costIampolicyGrantpermissions, {
          link: showHCS ? null : ( // remove when HCS docs links are available
            <Content
              key="link"
              component={ContentVariants.a}
              href={showHCS ? ENABLE_HCS_AWS_ACCOUNT : ENABLE_AWS_ACCOUNT}
              rel="noopener noreferrer"
              target="_blank"
            >
              {intl.formatMessage(messages.wizardLearnmore)}
            </Content>
          ),
        })}
      </Content>
      <Content component={ContentVariants.ol}>
        <Content component={ContentVariants.li}>{intl.formatMessage(messages.costIampolicySigniniamconsole)}</Content>
        <Content component={ContentVariants.li}>{intl.formatMessage(messages.costIampolicyCreatepolicy)}</Content>
        <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v6-u-m-sm-on-sm" isReadOnly>
          {JSON.stringify(buildIamPolicy(s3Bucket, aliasesEnabled, orgUnitsEnabled), null, 2)}
        </ClipboardCopy>
        <Content component={ContentVariants.li}>{intl.formatMessage(messages.costIampolicyCompleteproccess)}</Content>
      </Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(messages.costIampolicyLoginiam, {
          bold: <b key="bold">{intl.formatMessage(messages.costDonotcloseyourbrowser)}</b>,
        })}
      </Content>
    </Content>
  );
};

IAMPolicyDescription.propTypes = {
  showHCS: PropTypes.bool,
};

export const TagsDescription = ({ showHCS }) => {
  const intl = useIntl();
  const applicationName = showHCS ? HCS_APP_NAME : 'Cost Management';
  const rhelAws = useFlag('platform.sources.metered-rhel');

  return (
    <Fragment>
      <Content>
        {showHCS ? null : ( // remove when HCS docs links are available
          <Content component="p">
            <Content
              component={ContentVariants.a}
              rel="noopener noreferrer"
              target="_blank"
              href={showHCS ? CONFIG_HCS_AWS_TAGS : rhelAws ? RHEL_METERED_AWS : CONFIG_AWS_TAGS}
            >
              {intl.formatMessage(messages.costTagsReadmelink)}
            </Content>
          </Content>
        )}
        <Content component="p">{intl.formatMessage(messages.costTagsDesciption, { applicationName })}</Content>
        <Content component={ContentVariants.ol}>
          <Content component="li">{intl.formatMessage(messages.costTagsOpensection)}</Content>
          <Content component="li">{intl.formatMessage(messages.costTagsSelecttags, { applicationName })}</Content>
        </Content>
      </Content>
      {rhelAws ? <Alert variant="info" isInline title={intl.formatMessage(messages.costTagsAlerttitle)} /> : null}
    </Fragment>
  );
};

TagsDescription.propTypes = {
  showHCS: PropTypes.bool,
};

export const ArnDescription = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">{intl.formatMessage(messages.costArnEnableaccess)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.costArnSelectrole)}</Content>
        <Content component="li">{intl.formatMessage(messages.costArnCopyarn)}</Content>
      </Content>
    </Content>
  );
};

export const IncludeAliasesLabel = ({ appendTo }) => {
  const intl = useIntl();

  return (
    <Popover
      appendTo={appendTo}
      aria-label={intl.formatMessage(messages.helpTextAria)}
      position="right"
      maxWidth="40%"
      bodyContent={intl.formatMessage(messages.costArnIncludealiasespopover)}
    >
      <Button
        icon={<QuestionCircleIcon className="pf-v6-u-ml-sm" />}
        className="pf-v6-u-p-0 pf-v6-u-m-0"
        variant={ButtonVariant.plain}
      />
    </Popover>
  );
};

IncludeAliasesLabel.propTypes = {
  appendTo: PropTypes.instanceOf(Element).isRequired,
};

export const IncludeOrgUnitsLabel = ({ appendTo }) => {
  const intl = useIntl();

  return (
    <Popover
      appendTo={appendTo}
      aria-label={intl.formatMessage(messages.helpTextAria)}
      position="right"
      maxWidth="35%"
      bodyContent={intl.formatMessage(messages.costArnIncludeorgunitspopover)}
    >
      <Button
        icon={<QuestionCircleIcon className="pf-v6-u-ml-sm" />}
        className="pf-v6-u-p-0 pf-v6-u-m-0"
        variant={ButtonVariant.plain}
      />
    </Popover>
  );
};

IncludeOrgUnitsLabel.propTypes = {
  appendTo: PropTypes.instanceOf(Element).isRequired,
};
