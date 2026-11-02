import React, { Fragment, useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { ClipboardCopy, Content, ContentVariants } from '@patternfly/react-core';

import { HCCM_LATEST_DOCS_PREFIX, HCS_LATEST_DOCS_PREFIX } from '../../stringConstants';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { getSourcesApi } from '../../../../api/entities';
import { shallowEqual, useSelector } from 'react-redux';
import { HCS_APP_NAME } from '../../../../utilities/constants';

const COST_MANAGEMENT_APP_NAME = 'Cost Management';
const GCS_READ_BUCKET = 'storage.buckets.get';
const GCS_READ_OBJECTS = 'storage.objects.get';
const GCS_LIST_OBJECTS = 'storage.objects.list';
const GCS_BIGQUERY_JOBS_CREATE = 'bigquery.jobs.create';
const GCS_BIGQUERY_TABLES_GET_DATA = 'bigquery.tables.getData';
const GCS_BIGQUERY_TABLES_GET = 'bigquery.tables.get';
const GCS_BIGQUERY_TABLES_LIST = 'bigquery.tables.list';

const messages = defineMessages({
  costGcpProjectdescription: {
    id: 'cost.gcp.projectDescription',
    defaultMessage:
      'Google Cloud Platform (GCP) recommends that you create a cloud project to contain all your billing administration needs. We’ll use this project to set up your BigQuery billing export. {link}',
  },
  wizardLearnmore: {
    id: 'wizard.learnMore',
    defaultMessage: 'Learn more',
  },
  costGcpProjectdescription2: {
    id: 'cost.gcp.projectDescription2',
    defaultMessage: 'Enter the ID of a project within your GCP billing account.',
  },
  costGcpCloudstoragebucket: {
    id: 'cost.gcp.cloudStorageBucket',
    defaultMessage: 'You will need to create a cloud storage bucket that will contain the customized billing reports. {link}',
  },
  costLearnmore: {
    id: 'cost.learnMore',
    defaultMessage: 'Learn more',
  },
  costGcpCsbName: {
    id: 'cost.gcp.csb.name',
    defaultMessage: 'After creating the cloud storage bucket, enter its name in the following:',
  },
  costGcpIamroledescription: {
    id: 'cost.gcp.iamRoleDescription',
    defaultMessage: 'To specify GCP access permissions for Red Hat, create an Identity and Access Management (IAM) role.',
  },
  costGcpIamFirststep: {
    id: 'cost.gcp.iam.firstStep',
    defaultMessage: 'From the GCP console, navigate to <b>IAM & Admin > Roles.</b>',
  },
  costGcpIamFirststepb: {
    id: 'cost.gcp.iam.firstStepB',
    defaultMessage: 'Create a new role.',
  },
  costGcpIamSecondstep: {
    id: 'cost.gcp.iam.secondStep',
    defaultMessage: 'Add the following permissions to your custom role:',
  },
  costGcpIamThirdstep: {
    id: 'cost.gcp.iam.thirdStep',
    defaultMessage: 'Click <b>Create role.</b>',
  },
  costGcpDatasetDescription: {
    id: 'cost.gcp.dataset.description',
    defaultMessage: 'To collect and store the information needed for {application}, create a BigQuery dataset.',
  },
  costGcpDatasetFirststep: {
    id: 'cost.gcp.dataset.firstStep',
    defaultMessage: 'In the BigQuery console, select your project (<b>{projectId}</b>) from the navigation menu.',
  },
  costGcpDatasetSecondstep: {
    id: 'cost.gcp.dataset.secondStep',
    defaultMessage: 'Click <b>Create dataset.</b>',
  },
  costGcpDatasetThirdstep: {
    id: 'cost.gcp.dataset.thirdStep',
    defaultMessage: 'In the <b>Dataset ID</b> field, enter a name for your dataset.',
  },
  costGcpDatasetFourthstep: {
    id: 'cost.gcp.dataset.fourthStep',
    defaultMessage: 'Click <b>Create dataset.</b>',
  },
  costGcpNoaccount: {
    id: 'cost.gcp.noAccount',
    defaultMessage: 'There is an error with loading of the account address. Please go back and return to this step.',
  },
  costGcpAssignaccessdesc: {
    id: 'cost.gcp.assignAccessDesc',
    defaultMessage: 'To delegate account access, add a new member to your project.',
  },
  costGcpAccessFirststep: {
    id: 'cost.gcp.access.firstStep',
    defaultMessage: 'In your IAM & Admin console, navigate to <b>IAM</b> and click <b>Add</b> to add a new member.',
  },
  costGcpAccessSecondstep: {
    id: 'cost.gcp.access.secondStep',
    defaultMessage: 'Paste the following value into the <b>New members</b> field:',
  },
  costGcpAccessLoading: {
    id: 'cost.gcp.access.loading',
    defaultMessage: 'Loading account address...',
  },
  costGcpAccessThirdstep: {
    id: 'cost.gcp.access.thirdStep',
    defaultMessage: 'Select the role you just created.',
  },
  costGcpAccessFourthstep: {
    id: 'cost.gcp.access.fourthStep',
    defaultMessage: 'Click <b>Save.</b>',
  },
  costGcpCostprojectdescrption: {
    id: 'cost.gcp.costProjectDescrption',
    defaultMessage:
      'If there is a need to further customize the data you want to send to Cost Management, select the manually customize option to follow the special instructions on how to.',
  },
  costGcpBillingexportDescription: {
    id: 'cost.gcp.billingExport.description',
    defaultMessage: 'To enable detailed billing data exports to BigQuery, set up daily cost export.',
  },
  costGcpBillingexportFirststep: {
    id: 'cost.gcp.billingExport.firstStep',
    defaultMessage: 'In the Billing console, click <b>Billing export.</b>',
  },
  costGcpBillingexportFirststepb: {
    id: 'cost.gcp.billingExport.firstStepB',
    defaultMessage: 'Click the <b>BigQuery export</b> tab.',
  },
  costGcpBillingexportSecondstep: {
    id: 'cost.gcp.billingExport.secondStep',
    defaultMessage: 'In the <b>Detailed usage cost</b> section, click <b>Edit settings.</b>',
  },
  costGcpBillingexportThirdstep: {
    id: 'cost.gcp.billingExport.thirdStep',
    defaultMessage: 'Use the dropdown menus to select the correct project and dataset.',
  },
  costGcpBillingexportFourthstep: {
    id: 'cost.gcp.billingExport.fourthStep',
    defaultMessage: 'Click <b>Save.</b>',
  },
});

const b = (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>;

const PROJECT_LINK = `${HCCM_LATEST_DOCS_PREFIX}/integrate-integrate_google_cloud_data_with_cost_management`;
const PROJECT_HCS_LINK = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_google_cloud_data_into_hybrid_committed_spend/index`;
export const MANUAL_CUR_STEPS = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_google_cloud_data_into_cost_management/assembly-adding-filtered-gcp-int#configuring-function-post-reports-gcp-hcs_adding-filtered-gcp-int`;

export const Project = () => {
  const intl = useIntl();
  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);

  return (
    <Content>
      <Content component={ContentVariants.p} className="pf-v6-u-mb-lg">
        {intl.formatMessage(messages.costGcpProjectdescription, {
          link: showHCS ? null : ( // remove when HCS docs links are available
            <Content
              key="link"
              component={ContentVariants.a}
              href={showHCS ? PROJECT_HCS_LINK : PROJECT_LINK}
              rel="noopener noreferrer"
              target="_blank"
            >
              {intl.formatMessage(messages.wizardLearnmore)}
            </Content>
          ),
        })}
      </Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costGcpProjectdescription2)}</Content>
    </Content>
  );
};

export const CloudStorageBucket = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(messages.costGcpCloudstoragebucket, {
          link: (
            <Fragment>
              <Content key="link" component={ContentVariants.a} href={MANUAL_CUR_STEPS} rel="noopener noreferrer" target="_blank">
                {intl.formatMessage(messages.costLearnmore)}
              </Content>
            </Fragment>
          ),
        })}
      </Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costGcpCsbName)}</Content>
    </Content>
  );
};

export const IAMRole = () => {
  const intl = useIntl();
  const { getState } = useFormApi();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costGcpIamroledescription)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.costGcpIamFirststep, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpIamFirststepb, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpIamSecondstep)}</Content>
        <Content component="ul">
          <Content component="li">
            <b>{getState().values?.application?.extra?.storage_only ? GCS_READ_BUCKET : GCS_BIGQUERY_JOBS_CREATE}</b>
          </Content>
          <Content component="li">
            <b>{getState().values?.application?.extra?.storage_only ? GCS_READ_OBJECTS : GCS_BIGQUERY_TABLES_GET_DATA}</b>
          </Content>
          <Content component="li">
            <b>{getState().values?.application?.extra?.storage_only ? GCS_LIST_OBJECTS : GCS_BIGQUERY_TABLES_GET}</b>
          </Content>
          {!getState().values?.application?.extra?.storage_only && (
            <Content component="li">
              <b>{GCS_BIGQUERY_TABLES_LIST}</b>
            </Content>
          )}
        </Content>
        <Content component="li">{intl.formatMessage(messages.costGcpIamThirdstep, { b })}</Content>
      </Content>
    </Content>
  );
};

export const Dataset = () => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);
  const projectId = getState().values.authentication?.username;

  return (
    <Content>
      <Content component={ContentVariants.p}>
        {intl.formatMessage(messages.costGcpDatasetDescription, {
          application: showHCS ? HCS_APP_NAME : COST_MANAGEMENT_APP_NAME,
        })}
      </Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.costGcpDatasetFirststep, { b, projectId })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpDatasetSecondstep, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpDatasetThirdstep, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpDatasetFourthstep, { b })}</Content>
      </Content>
    </Content>
  );
};

export const AssignAccess = () => {
  const intl = useIntl();
  const [googleAccount, setGoogleAccount] = useState();

  useEffect(() => {
    const errorMessage = intl.formatMessage(messages.costGcpNoaccount);

    getSourcesApi()
      .getGoogleAccount()
      .then((data) =>
        setGoogleAccount(data?.data?.find((item) => item?.payload?.includes('billing-export'))?.payload || errorMessage),
      )
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setGoogleAccount(errorMessage);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  }, []);

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costGcpAssignaccessdesc)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.costGcpAccessFirststep, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpAccessSecondstep, { b })}</Content>
        <ClipboardCopy className="pf-v6-u-m-sm  pf-v6-u-ml-0" isReadOnly>
          {googleAccount || intl.formatMessage(messages.costGcpAccessLoading)}
        </ClipboardCopy>
        <Content component="li">{intl.formatMessage(messages.costGcpAccessThirdstep, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpAccessFourthstep, { b })}</Content>
      </Content>
    </Content>
  );
};

export const ProjectDescription = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costGcpCostprojectdescrption)}</Content>
    </Content>
  );
};

export const BillingExport = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.costGcpBillingexportDescription)}</Content>
      <Content component={ContentVariants.ol}>
        <Content component="li">{intl.formatMessage(messages.costGcpBillingexportFirststep, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpBillingexportFirststepb, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpBillingexportSecondstep, { b })}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpBillingexportThirdstep)}</Content>
        <Content component="li">{intl.formatMessage(messages.costGcpBillingexportFourthstep, { b })}</Content>
      </Content>
    </Content>
  );
};
