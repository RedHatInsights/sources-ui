import React, { useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

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
const ROLE_NAME = 'RH_HCC_provisioning_role';

export const ProjectID = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">
        {intl.formatMessage({
          id: 'provisioning.project-id.desc',
          defaultMessage: 'Login to Google Cloud Plattform and Copy your project ID',
        })}
      </Content>
    </Content>
  );
};

export const ConnectGCP = () => {
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
    return (
      <Alert
        variant="warning"
        title={
          <FormattedMessage
            id="provisioning.iam.fetchError"
            defaultMessage="There was an error while loading the commands. Please go back and return to this step to try again."
          />
        }
      />
    );
  }

  if (!gcpServiceAccount) {
    return (
      <Content>
        <Content component={ContentVariants.p}>
          <FormattedMessage id="provisioning.iam.loading" defaultMessage="Loading configuration..." />
        </Content>
      </Content>
    );
  }

  return (
    <>
      <Stack hasGutter>
        <StackItem>
          <Content component="p">
            <FormattedMessage
              defaultMessage="To delegate account access, create a custom role and grant it to Red Hat service account."
              id="provisioning.gcp-role-creation.desc"
            />
          </Content>
        </StackItem>
        <StackItem>
          <ExpandableSection isIndented toggleText="See role permissions">
            <Content component="p">
              <Content component="dl">
                <Content component="li">compute.disks.create</Content>
                <Content component="li">compute.images.useReadOnly</Content>
                <Content component="li">compute.instanceTemplates.create</Content>
                <Content component="li">compute.instanceTemplates.list</Content>
                <Content component="li">compute.instanceTemplates.useReadOnly</Content>
                <Content component="li">compute.instances.create</Content>
                <Content component="li">compute.instances.get</Content>
                <Content component="li">compute.instances.list</Content>
                <Content component="li">compute.instances.setLabels</Content>
                <Content component="li">compute.instances.setMetadata</Content>
                <Content component="li">compute.instances.setServiceAccount</Content>
                <Content component="li">compute.networks.useExternalIp</Content>
                <Content component="li">compute.subnetworks.use</Content>
                <Content component="li">compute.subnetworks.useExternalIp</Content>
                <Content component="li">iam.roles.get</Content>
                <Content component="li">iam.serviceAccounts.actAs</Content>
                <Content component="li">iam.serviceAccounts.getIamPolicy</Content>
                <Content component="li">resourcemanager.projects.getIamPolicy</Content>
                <Content component="li">serviceusage.services.use</Content>
                <Content component="li">compute.instances.setTags</Content>
                <Content component="li">compute.regions.list</Content>
              </Content>
            </Content>
          </ExpandableSection>
        </StackItem>
        <StackItem>
          <Content>
            <FormattedMessage
              id="provisioning.gcp-role-creation-follow.desc"
              defaultMessage="Follow these steps to create the role:"
            />
          </Content>
        </StackItem>
        <StackItem>
          <Content>
            <Content component={ListComponent.ol}>
              <Content component="li">
                <FormattedMessage
                  id="provisioning.gcp-role-step-1"
                  defaultMessage="Click on {connectGCP} to open Google cloud shell in a new tab."
                  values={{ connectGCP: <strong>&apos;Connect Google Cloud&apos;</strong> }}
                />
              </Content>
              <Content component="li">
                <FormattedMessage
                  id="provisioning.aws-role-step-2"
                  defaultMessage="In the cloud shell, paste this {script} to initiate the creation and binding the role. Wait until the the process has done."
                  values={{
                    script: (
                      <ClipboardCopy hoverTip="Copy script" clickTip="script Copied" variant="expansion">
                        {script}
                      </ClipboardCopy>
                    ),
                  }}
                />
              </Content>
              <Content component="li">
                <FormattedMessage
                  id="provisioning.aws-role-step-3"
                  defaultMessage="Return to this window and click {next}."
                  values={{ next: <strong>&apos;Next&apos;</strong> }}
                />
              </Content>
            </Content>
          </Content>
        </StackItem>
        <StackItem>
          <Button component="a" target="_blank" href={cloudShellURL} isBlock variant="primary">
            Connect Google Cloud
          </Button>
        </StackItem>
      </Stack>
    </>
  );
};
