import React, { Fragment, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { ClipboardCopy, Text, TextContent, TextList, TextListItem, TextListVariants, TextVariants } from '@patternfly/react-core';

import { HCCM_LATEST_DOCS_PREFIX, HCS_LATEST_DOCS_PREFIX } from '../../stringConstants';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

import { getSourcesApi } from '../../../../api/entities';
import { shallowEqual, useSelector } from 'react-redux';
import { HCS_APP_NAME } from '../../../../utilities/constants';

const b = (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>;

const PROJECT_LINK = `${HCCM_LATEST_DOCS_PREFIX}/html/integrating_google_cloud_data_into_cost_management`;
const PROJECT_HCS_LINK = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_google_cloud_data_into_hybrid_committed_spend/index`;
export const MANUAL_CUR_STEPS = `${HCS_LATEST_DOCS_PREFIX}/html/integrating_google_cloud_data_into_cost_management/assembly-adding-filtered-gcp-int#configuring-function-post-reports-gcp-hcs_adding-filtered-gcp-int`;

export const Project = () => {
  const intl = useIntl();
  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);

  return (
    <TextContent>
      <Text component={TextVariants.p} className="pf-v5-u-mb-lg">
        {intl.formatMessage(
          {
            id: 'cost.gcp.projectDescription',
            defaultMessage:
              'Google Cloud Platform (GCP) recommends that you create a cloud project to contain all your billing administration needs. We’ll use this project to set up your BigQuery billing export. {link}',
          },
          {
            link: showHCS ? null : ( // remove when HCS docs links are available
              <Text
                key="link"
                component={TextVariants.a}
                href={showHCS ? PROJECT_HCS_LINK : PROJECT_LINK}
                rel="noopener noreferrer"
                target="_blank"
              >
                {intl.formatMessage({
                  id: 'wizard.learnMore',
                  defaultMessage: 'Learn more',
                })}
              </Text>
            ),
          },
        )}
      </Text>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.gcp.projectDescription2',
          defaultMessage: 'Enter the ID of a project within your GCP billing account.',
        })}
      </Text>
    </TextContent>
  );
};

export const CloudStorageBucket = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage(
          {
            id: 'cost.gcp.cloudStorageBucket',
            defaultMessage:
              'You will need to create a cloud storage bucket that will contain the customized billing reports. {link}',
          },
          {
            link: (
              <Fragment>
                <Text key="link" component={TextVariants.a} href={MANUAL_CUR_STEPS} rel="noopener noreferrer" target="_blank">
                  {intl.formatMessage({
                    id: 'cost.learnMore',
                    defaultMessage: 'Learn more',
                  })}
                </Text>
              </Fragment>
            ),
          },
        )}
      </Text>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.gcp.csb.name',
          defaultMessage: 'After creating the cloud storage bucket, enter its name in the following:',
        })}
      </Text>
    </TextContent>
  );
};

export const IAMRole = () => {
  const intl = useIntl();
  const { getState } = useFormApi();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.gcp.iamRoleDescription',
          defaultMessage: 'To specify GCP access permissions for Red Hat, create an Identity and Access Management (IAM) role.',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.iam.firstStep',
              defaultMessage: 'From the GCP console, navigate to <b>IAM & Admin > Roles.</b>',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.iam.firstStepB',
              defaultMessage: 'Create a new role.',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'cost.gcp.iam.secondStep',
            defaultMessage: 'Add the following permissions to your custom role:',
          })}
        </TextListItem>
        <TextList>
          <TextListItem>
            <b>{getState().values?.application?.extra?.storage_only ? 'storage.buckets.get' : 'bigquery.jobs.create'}</b>
          </TextListItem>
          <TextListItem>
            <b>{getState().values?.application?.extra?.storage_only ? 'storage.objects.get' : 'bigquery.tables.getData'}</b>
          </TextListItem>
          <TextListItem>
            <b>{getState().values?.application?.extra?.storage_only ? 'storage.objects.list' : 'bigquery.tables.get'}</b>
          </TextListItem>
          {!getState().values?.application?.extra?.storage_only && (
            <TextListItem>
              <b>bigquery.tables.list</b>
            </TextListItem>
          )}
        </TextList>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.iam.thirdStep',
              defaultMessage: 'Click <b>Create role.</b>',
            },
            { b },
          )}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

export const Dataset = () => {
  const intl = useIntl();
  const { getState } = useFormApi();

  const showHCS = useSelector(({ sources }) => sources.hcsEnrolled, shallowEqual);
  const projectId = getState().values.authentication?.username;

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage(
          {
            id: 'cost.gcp.dataset.description',
            defaultMessage: 'To collect and store the information needed for {application}, create a BigQuery dataset.',
          },
          { application: showHCS ? HCS_APP_NAME : 'Cost Management' },
        )}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.dataset.firstStep',
              defaultMessage: 'In the BigQuery console, select your project (<b>{projectId}</b>) from the navigation menu.',
            },
            { b, projectId },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.dataset.secondStep',
              defaultMessage: 'Click <b>Create dataset.</b>',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.dataset.thirdStep',
              defaultMessage: 'In the <b>Dataset ID</b> field, enter a name for your dataset.',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.dataset.fourthStep',
              defaultMessage: 'Click <b>Create dataset.</b>',
            },
            { b },
          )}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

export const AssignAccess = () => {
  const intl = useIntl();
  const [googleAccount, setGoogleAccount] = useState();

  useEffect(() => {
    const errorMessage = intl.formatMessage({
      id: 'cost.gcp.noAccount',
      defaultMessage: 'There is an error with loading of the account address. Please go back and return to this step.',
    });

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
  }, []);

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.gcp.assignAccessDesc',
          defaultMessage: 'To delegate account access, add a new member to your project.',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.access.firstStep',
              defaultMessage: 'In your IAM & Admin console, navigate to <b>IAM</b> and click <b>Add</b> to add a new member.',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.access.secondStep',
              defaultMessage: 'Paste the following value into the <b>New members</b> field:',
            },
            { b },
          )}
        </TextListItem>
        <ClipboardCopy className="pf-v5-u-m-sm  pf-v5-u-ml-0" isReadOnly>
          {googleAccount || intl.formatMessage({ id: 'cost.gcp.access.loading', defaultMessage: 'Loading account address...' })}
        </ClipboardCopy>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.access.thirdStep',
              defaultMessage: 'Select the role you just created.',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.access.fourthStep',
              defaultMessage: 'Click <b>Save.</b>',
            },
            { b },
          )}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

export const ProjectDescription = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage(
          {
            id: 'cost.gcp.costProjectDescrption',
            defaultMessage:
              'If there is a need to further customize the data you want to send to Cost Management, select the manually customize option to follow the special instructions on how to. {link}',
          },
          {
            link: (
              <Fragment>
                <Text key="link" component={TextVariants.a} href={MANUAL_CUR_STEPS} rel="noopener noreferrer" target="_blank">
                  {intl.formatMessage({
                    id: 'cost.learnMore',
                    defaultMessage: 'Learn more',
                  })}
                </Text>
              </Fragment>
            ),
          },
        )}
      </Text>
    </TextContent>
  );
};

export const BillingExport = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'cost.gcp.billingExport.description',
          defaultMessage: 'To enable detailed billing data exports to BigQuery, set up daily cost export.',
        })}
      </Text>
      <TextList component={TextListVariants.ol}>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.billingExport.firstStep',
              defaultMessage: 'In the Billing console, click <b>Billing export.</b>',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.billingExport.firstStepB',
              defaultMessage: 'Click the <b>BigQuery export</b> tab.',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.billingExport.secondStep',
              defaultMessage: 'In the <b>Detailed usage cost</b> section, click <b>Edit settings.</b>',
            },
            { b },
          )}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage({
            id: 'cost.gcp.billingExport.thirdStep',
            defaultMessage: 'Use the dropdown menus to select the correct project and dataset.',
          })}
        </TextListItem>
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'cost.gcp.billingExport.fourthStep',
              defaultMessage: 'Click <b>Save.</b>',
            },
            { b },
          )}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};
