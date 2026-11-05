import React, { useEffect, useState } from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { Alert, Button, ClipboardCopy, Content, ContentVariants } from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { getSourcesApi } from '../../../../api/entities';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

const ANSIBLE_INSTALL_CMD = 'ansible-galaxy collection install redhatinsights.subscriptions';
const ANSIBLE_VERIFY_CMD =
  'ansible-playbook -i <AZURE_VM_HOSTNAME>, -b ~/.ansible/collections/ansible_collections/redhatinsights/subscriptions/playbooks/verify_account.yml -e rh_api_refresh_token=<OFFLINE_AUTH_TOKEN>';

const messages = defineMessages({
  subwatchAzureTokendesc: {
    id: 'subwatch.azure.tokenDesc',
    defaultMessage: 'Generate a token to authenticate the calls to APIs for Red Hat services.',
  },
  subwatchAzureTokenlink: {
    id: 'subwatch.azure.tokenLink',
    defaultMessage: 'To obtain an offline token, follow the steps at {link}.',
  },
  subwatchAzureAnsibleplaybookdesc: {
    id: 'subwatch.azure.ansiblePlaybookDesc',
    defaultMessage: 'Download and run the following commands against a running Azure VM.',
  },
  subwatchIampolicySubwatchconfigerror: {
    id: 'subwatch.iampolicy.subWatchConfigError',
    defaultMessage: 'There is an error with loading of the configuration. Please go back and return to this step.',
  },
  costAzureAlerttitle: {
    id: 'subwatch.azure.alertTitle',
    defaultMessage: 'Azure role requirements',
  },
  subwatchLighthouseDesc: {
    id: 'subwatch.lighthouse.desc',
    defaultMessage:
      'To complete this step, your Azure account must have the Owner role, at a minimum, for the selected subscription. View the {link} for more information.',
  },
  subwatchLighthouseAzuredocs: {
    id: 'subwatch.lighthouse.azureDocs',
    defaultMessage: 'Azure documentation',
  },
  subwatchLighthouseDesc_1: {
    id: 'subwatch.lighthouse.deployStep',
    defaultMessage:
      'In Azure Lighthouse, deploy the Azure Resource Manager custom template that connects your Red Hat and Azure accounts. When ready, click <b>Go to Lighthouse</b> and follow these instructions:',
  },
  subwatchLighthouseSelectazuresubscription: {
    id: 'subwatch.lighthouse.selectAzureSubscription',
    defaultMessage: 'Select the Azure subscription that you want to use with RHEL management.',
  },
  subwatchLighthouseEditinstancedetails: {
    id: 'subwatch.lighthouse.editInstanceDetails',
    defaultMessage: 'Edit any other instance details and click <b>Review + create</b>.',
  },
  subwatchLighthouseClickcreatetorundeployment: {
    id: 'subwatch.lighthouse.clickCreateToRunDeployment',
    defaultMessage:
      'Click <b>Create</b> to run the deployment. This action creates two roles in your Azure account: {readerLink} and {roleLink}.',
  },
  subwatchLighthouseReader: {
    id: 'subwatch.lighthouse.reader',
    defaultMessage: 'Reader',
  },
  subwatchLighthouseRolelink: {
    id: 'subwatch.lighthouse.roleLink',
    defaultMessage: 'Managed Services Registration assignment Delete Role',
  },
  subwatchLighthouseCopysubscriptionid: {
    id: 'subwatch.lighthouse.copySubscriptionId',
    defaultMessage: 'When the deployment is complete, click <b>Go to subscription</b> and copy the <b>Subscription ID</b>.',
  },
  subwatchLighthouseButton: {
    id: 'subwatch.lighthouse.button',
    defaultMessage: 'Go to Lighthouse',
  },
  subwatchSubscriptionidDesc: {
    id: 'subwatch.subscriptionId.desc',
    defaultMessage: 'Paste your Azure subscription ID from the previous step into the field below.',
  },
});

const API_LINK = 'https://access.redhat.com/management/api';
const AZURE_DOCS_LINK =
  'https://learn.microsoft.com/en-us/azure/lighthouse/how-to/onboard-customer#deploy-the-azure-resource-manager-template';
const READER_LINK = 'https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/general#reader';
const ROLE_LINK =
  'https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/management-and-governance#managed-services-registration-assignment-delete-role';

const b = (chunks) => <b key={`b-${chunks.length}-${Math.floor(Math.random() * 1000)}`}>{chunks}</b>;

export const OfflineToken = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">{intl.formatMessage(messages.subwatchAzureTokendesc)}</Content>
      <Content component={ContentVariants.ol} className="pf-v6-u-ml-0">
        <Content component="li">
          {intl.formatMessage(messages.subwatchAzureTokenlink, {
            link: (
              <Content key="link" rel="noopener noreferrer" target="_blank" component={ContentVariants.a} href={API_LINK}>
                {API_LINK}
              </Content>
            ),
          })}
        </Content>
      </Content>
    </Content>
  );
};

export const AnsiblePlaybook = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.subwatchAzureAnsibleplaybookdesc)}</Content>
      <ClipboardCopy className="pf-v6-u-mb-lg">{ANSIBLE_INSTALL_CMD}</ClipboardCopy>
      <ClipboardCopy>{ANSIBLE_VERIFY_CMD}</ClipboardCopy>
    </Content>
  );
};

export const LightHouseDescription = () => {
  const intl = useIntl();
  const [link, setLink] = useState();
  const [error, setError] = useState(null);

  const formOptions = useFormApi();

  useEffect(() => {
    getSourcesApi()
      .getLighthouseLink()
      .then(({ data }) => setLink(data?.[0]?.payload))
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(e);
        setError(intl.formatMessage(messages.subwatchIampolicySubwatchconfigerror));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- pre-existing pattern, see i18n cleanup ticket
  }, []);

  return (
    <>
      <Alert variant="info" isInline title={intl.formatMessage(messages.costAzureAlerttitle)}>
        {intl.formatMessage(messages.subwatchLighthouseDesc, {
          link: (
            <a key="link" href={AZURE_DOCS_LINK} rel="noopener noreferrer" target="_blank">
              {intl.formatMessage(messages.subwatchLighthouseAzuredocs)}
            </a>
          ),
        })}
      </Alert>
      <Content>
        <Content component="p">{intl.formatMessage(messages.subwatchLighthouseDesc_1, { b })}</Content>
        <Content component={ContentVariants.ol} className="pf-v6-u-ml-0">
          <Content component={ContentVariants.li}>
            {intl.formatMessage(messages.subwatchLighthouseSelectazuresubscription)}
          </Content>
          <Content component={ContentVariants.li}>
            {intl.formatMessage(messages.subwatchLighthouseEditinstancedetails, { b })}
          </Content>
          <Content component={ContentVariants.li}>
            {intl.formatMessage(messages.subwatchLighthouseClickcreatetorundeployment, {
              b,
              readerLink: (
                <a key="reader link" href={READER_LINK} rel="noopener noreferrer" target="_blank">
                  {intl.formatMessage(messages.subwatchLighthouseReader)}
                </a>
              ),
              roleLink: (
                <a key="role link" href={ROLE_LINK} rel="noopener noreferrer" target="_blank">
                  {intl.formatMessage(messages.subwatchLighthouseRolelink)}
                </a>
              ),
            })}
          </Content>
          <Content component={ContentVariants.li}>
            {intl.formatMessage(messages.subwatchLighthouseCopysubscriptionid, { b })}
          </Content>
        </Content>
      </Content>
      <Button
        style={{ width: 'fit-content' }}
        icon={<ExternalLinkAltIcon className="pf-v6-u-ml-md" />}
        iconPosition="end"
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        isLoading={!link}
        isDisabled={!link}
        onClick={() => {
          formOptions.change('lighthouse-clicked', true);
        }}
      >
        {intl.formatMessage(messages.subwatchLighthouseButton)}
      </Button>
      {error}
    </>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">{intl.formatMessage(messages.subwatchSubscriptionidDesc)}</Content>
    </Content>
  );
};
