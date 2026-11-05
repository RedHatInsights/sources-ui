import React, { useEffect, useState } from 'react';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';

import {
  Alert,
  Button,
  ClipboardCopy,
  Content,
  ContentVariants,
  ExpandableSection,
  ListComponent,
  Stack,
  StackItem,
} from '@patternfly/react-core';
import { useFormApi } from '@data-driven-forms/react-form-renderer';

import { getSourcesApi } from '../../../../api/entities';

const GCP_ROLE_PERMISSIONS = [
  'compute.disks.create',
  'compute.images.useReadOnly',
  'compute.instanceTemplates.create',
  'compute.instanceTemplates.list',
  'compute.instanceTemplates.useReadOnly',
  'compute.instances.create',
  'compute.instances.get',
  'compute.instances.list',
  'compute.instances.setLabels',
  'compute.instances.setMetadata',
  'compute.instances.setServiceAccount',
  'compute.networks.useExternalIp',
  'compute.subnetworks.use',
  'compute.subnetworks.useExternalIp',
  'iam.roles.get',
  'iam.serviceAccounts.actAs',
  'iam.serviceAccounts.getIamPolicy',
  'resourcemanager.projects.getIamPolicy',
  'serviceusage.services.use',
  'compute.instances.setTags',
  'compute.regions.list',
];

const BOLD_CONNECT_GCP = <strong>&apos;Connect Google Cloud&apos;</strong>;
const BOLD_NEXT = <strong>&apos;Next&apos;</strong>;

const messages = defineMessages({
  provisioningGcpRoleStep1: {
    id: 'provisioning.gcp-role-step-1',
    defaultMessage: 'Click on {connectGCP} to open Google cloud shell in a new tab.',
  },
  provisioningAwsRoleStep2: {
    id: 'provisioning.gcp-role-step-2',
    defaultMessage:
      'In the cloud shell, paste this {script} to initiate the creation and binding the role. Wait until the the process has done.',
  },
  provisioningAwsRoleStep3: {
    id: 'provisioning.gcp-role-step-3',
    defaultMessage: 'Return to this window and click {next}.',
  },
  seeRolePermissions: {
    id: 'provisioningGcp.seeRolePermissions',
    defaultMessage: 'See role permissions',
  },
  connectGoogleCloud: {
    id: 'provisioningGcp.connectGoogleCloud',
    defaultMessage: 'Connect Google Cloud',
  },
  copyScript: {
    id: 'provisioningGcp.copyScript',
    defaultMessage: 'Copy script',
  },
  scriptCopied: {
    id: 'provisioningGcp.scriptCopied',
    defaultMessage: 'script Copied',
  },

  provisioningGcpRoleCreationDesc: {
    id: 'provisioning.gcp-role-creation.desc',
    defaultMessage: 'To delegate account access, create a custom role and grant it to Red Hat service account.',
  },
  provisioningProjectIdDesc: {
    id: 'provisioning.project-id.desc',
    defaultMessage: 'Login to Google Cloud Plattform and Copy your project ID',
  },
  provisioningIamFetcherror: {
    id: 'provisioning.iam.fetchError',
    defaultMessage: 'There was an error while loading the commands. Please go back and return to this step to try again.',
  },
  provisioningIamLoading: {
    id: 'provisioning.iam.loading',
    defaultMessage: 'Loading configuration...',
  },
  provisioningGcpRoleCreationFollowDesc: {
    id: 'provisioning.gcp-role-creation-follow.desc',
    defaultMessage: 'Follow these steps to create the role:',
  },
});

const ROLE_NAME = 'RH_HCC_provisioning_role';

export const ProjectID = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">{intl.formatMessage(messages.provisioningProjectIdDesc)}</Content>
    </Content>
  );
};

export const ConnectGCP = () => {
  const intl = useIntl();
  const formApi = useFormApi().getState();
  const ProjectID = formApi.values.authentication.username;
  const [provAppTypeId, setAppTypeId] = useState();
  const [gcpServiceAccount, setGcpServiceAccount] = useState();
  const [fetchError, setFetchError] = useState(null);

  const cloudShellURL = `https://console.cloud.google.com/cloudshell/editor?project=${ProjectID}&cloudshell=true&shellonly=true`;
  const script = `
  ROLE_NAME=${ROLE_NAME} &&
  PROJECT_ID=${ProjectID} &&
  
  gcloud iam roles create "$ROLE_NAME" --project="$PROJECT_ID" --title="$ROLE_NAME" --permissions=compute.disks.create,compute.images.useReadOnly,compute.instanceTemplates.create,compute.instanceTemplates.list,compute.instanceTemplates.useReadOnly,compute.instances.create,compute.instances.get,compute.instances.list,compute.instances.setLabels,compute.instances.setMetadata,compute.instances.setServiceAccount,compute.networks.useExternalIp,compute.subnetworks.use,compute.subnetworks.useExternalIp,iam.roles.get,iam.serviceAccounts.actAs,iam.serviceAccounts.getIamPolicy,resourcemanager.projects.getIamPolicy,serviceusage.services.use,compute.instances.setTags,compute.regions.list && \
  gcloud projects add-iam-policy-binding "$PROJECT_ID" --member="${gcpServiceAccount}" --role="projects/$PROJECT_ID/roles/$ROLE_NAME"
  `;
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

  if (fetchError) {
    return <Alert variant="warning" title={<FormattedMessage {...messages.provisioningIamFetcherror} />} />;
  }

  if (!gcpServiceAccount) {
    return (
      <Content>
        <Content component={ContentVariants.p}>
          <FormattedMessage {...messages.provisioningIamLoading} />
        </Content>
      </Content>
    );
  }

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Content component="p">
            <FormattedMessage {...messages.provisioningGcpRoleCreationDesc} />
          </Content>
        </StackItem>
        <StackItem>
          <ExpandableSection isIndented toggleText={intl.formatMessage(messages.seeRolePermissions)}>
            <Content component="p">
              <Content component="dl">
                {GCP_ROLE_PERMISSIONS.map((permission) => (
                  <Content component="li" key={permission}>
                    {permission}
                  </Content>
                ))}
              </Content>
            </Content>
          </ExpandableSection>
        </StackItem>
        <StackItem>
          <Content>
            <FormattedMessage {...messages.provisioningGcpRoleCreationFollowDesc} />
          </Content>
        </StackItem>
        <StackItem>
          <Content>
            <Content component={ListComponent.ol}>
              <Content component="li">
                <FormattedMessage {...messages.provisioningGcpRoleStep1} values={{ connectGCP: BOLD_CONNECT_GCP }} />
              </Content>
              <Content component="li">
                <FormattedMessage
                  {...messages.provisioningAwsRoleStep2}
                  values={{
                    script: (
                      <ClipboardCopy
                        hoverTip={intl.formatMessage(messages.copyScript)}
                        clickTip={intl.formatMessage(messages.scriptCopied)}
                        variant="expansion"
                      >
                        {script}
                      </ClipboardCopy>
                    ),
                  }}
                />
              </Content>
              <Content component="li">
                <FormattedMessage {...messages.provisioningAwsRoleStep3} values={{ next: BOLD_NEXT }} />
              </Content>
            </Content>
          </Content>
        </StackItem>
        <StackItem>
          <Button component="a" target="_blank" href={cloudShellURL} isBlock variant="primary">
            {intl.formatMessage(messages.connectGoogleCloud)}
          </Button>
        </StackItem>
      </Stack>
    </>
  );
};
