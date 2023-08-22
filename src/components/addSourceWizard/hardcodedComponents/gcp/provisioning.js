import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import {
  Alert,
  ClipboardCopy,
  ClipboardCopyVariant,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';
import { useFormApi } from '@data-driven-forms/react-form-renderer';

import { getSourcesApi } from '../../../../api/entities';
const ROLE_NAME = 'RH_HCC_provisioning_role';
const ROLE_COMMAND_STRING = `ROLE_NAME=$(gcloud iam roles create ${ROLE_NAME} --project=<PROJECT_ID> --title=${ROLE_NAME} --permissions=compute.disks.create,compute.images.useReadOnly,compute.instanceTemplates.create,compute.instanceTemplates.list,compute.instanceTemplates.useReadOnly,compute.instances.create,compute.instances.get,compute.instances.list,compute.instances.setLabels,compute.instances.setMetadata,compute.instances.setServiceAccount,compute.networks.useExternalIp,compute.subnetworks.use,compute.subnetworks.useExternalIp,iam.roles.get,iam.serviceAccounts.actAs,iam.serviceAccounts.getIamPolicy,resourcemanager.projects.getIamPolicy,serviceusage.services.use,compute.instances.setTags,compute.regions.list | grep -oP 'name:\\s+\\K.+')`;

const ATTACH_ROLE_COMMAND_STRING = `gcloud projects add-iam-policy-binding <PROJECT_ID> --member=<PROVISIONING_SERVICE_ACCOUNT> --role=$ROLE_NAME`;

export const AddRole = () => {
  const formApi = useFormApi().getState();
  const ProjectID = formApi.values.authentication.username;
  const intl = useIntl();
  const [provAppTypeId, setAppTypeId] = useState();
  const [gcpServiceAccount, setGcpServiceAccount] = useState();
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    getSourcesApi()
      .getProvAppType()
      .then((data) => setAppTypeId(data?.data?.[0]?.id || null))
      .catch((_e) => {
        setFetchError(true);
      });
  }, []);

  useEffect(() => {
    if (provAppTypeId) {
      getSourcesApi()
        .getProvisioningServiceAccount(provAppTypeId)
        .then((data) => {
          const principal = data?.data?.[0]?.payload;
          principal ? setGcpServiceAccount('serviceAccount:' + principal) : setFetchError(true);
        })
        .catch((_e) => {
          setFetchError(true);
        });
    }
  }, [provAppTypeId]);

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'provisioning.gcp.delegateAccount',
          defaultMessage: 'To delegate account access, create a custom role and grant it to Red Hat service account.',
        })}
      </Text>
      {gcpServiceAccount === undefined && fetchError === null && (
        <Text component={TextVariants.p}>
          {intl.formatMessage({ id: 'provisioning.gcp.loading', defaultMessage: 'Loading configuration...' })}
        </Text>
      )}
      {fetchError && (
        <Alert
          variant="warning"
          title={intl.formatMessage({
            id: 'provisioning.gcp.fetchError',
            defaultMessage: 'There was an error while loading the commands. Please go back and return to this step to try again.',
          })}
        />
      )}
      {gcpServiceAccount !== null && (
        <TextList component={TextListVariants.ol}>
          <TextListItem>
            {intl.formatMessage({
              id: 'provisioning.gcp.createRole',
              defaultMessage: 'Create a new custom role and fetch the role name:',
            })}
            <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v5-u-m-sm-on-sm" isReadOnly>
              {ROLE_COMMAND_STRING.replace('<PROJECT_ID>', ProjectID)}
            </ClipboardCopy>
          </TextListItem>
          <TextListItem>
            {intl.formatMessage({
              id: 'provisioning.gcp.attachRole',
              defaultMessage: 'Attach the role that you just created to Red Hat service account to grant permissions.',
            })}
          </TextListItem>
          <ClipboardCopy isCode variant={ClipboardCopyVariant.expansion} className="pf-v5-u-m-sm-on-sm" isReadOnly>
            {ATTACH_ROLE_COMMAND_STRING.replace('<PROVISIONING_SERVICE_ACCOUNT>', gcpServiceAccount).replace(
              '<PROJECT_ID>',
              ProjectID
            )}
          </ClipboardCopy>
        </TextList>
      )}
    </TextContent>
  );
};

export const ProjectID = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'provisioning.project-id.desc',
          defaultMessage: 'Login to Google Cloud Plattform and Copy your project ID',
        })}
      </Text>
    </TextContent>
  );
};
