import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import {
  Alert,
  Button,
  ClipboardCopy,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListItemVariants,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';

import { getSourcesApi } from '../../../../api/entities';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';

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
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'subwatch.azure.tokenDesc',
          defaultMessage: 'Generate a token to authenticate the calls to APIs for Red Hat services.',
        })}
      </Text>
      <TextList component={TextListVariants.ol} className="pf-v5-u-ml-0">
        <TextListItem>
          {intl.formatMessage(
            {
              id: 'subwatch.azure.tokenLink',
              defaultMessage: 'To obtain an offline token, follow the steps at {link}.',
            },
            {
              link: (
                <Text key="link" rel="noopener noreferrer" target="_blank" component={TextVariants.a} href={API_LINK}>
                  {API_LINK}
                </Text>
              ),
            },
          )}
        </TextListItem>
      </TextList>
    </TextContent>
  );
};

export const AnsiblePlaybook = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text component={TextVariants.p}>
        {intl.formatMessage({
          id: 'subwatch.azure.ansiblePlaybookDesc',
          defaultMessage: 'Download and run the following commands against a running Azure VM.',
        })}
      </Text>
      <ClipboardCopy className="pf-v5-u-mb-lg">ansible-galaxy collection install redhatinsights.subscriptions</ClipboardCopy>
      <ClipboardCopy>
        {
          'ansible-playbook -i <AZURE_VM_HOSTNAME>, -b ~/.ansible/collections/ansible_collections/redhatinsights/subscriptions/playbooks/verify_account.yml -e rh_api_refresh_token=<OFFLINE_AUTH_TOKEN>'
        }
      </ClipboardCopy>
    </TextContent>
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
        setError(
          intl.formatMessage({
            id: 'subwatch.iampolicy.subWatchConfigError',
            defaultMessage: 'There is an error with loading of the configuration. Please go back and return to this step.',
          }),
        );
      });
  }, []);

  return (
    <>
      <Alert
        variant="info"
        isInline
        title={intl.formatMessage({
          id: 'cost.azure.alertTitle',
          defaultMessage: 'Azure role requirements',
        })}
      >
        {intl.formatMessage(
          {
            id: 'subwatch.lighthouse.desc',
            defaultMessage:
              'To complete this step, your Azure account must have the Owner role, at a minimum, for the selected subscription. View the {link} for more information.',
          },
          {
            link: (
              <a key="link" href={AZURE_DOCS_LINK} rel="noopener noreferrer" target="_blank">
                {intl.formatMessage({
                  id: 'subwatch.lighthouse.azureDocs',
                  defaultMessage: 'Azure documentation',
                })}
              </a>
            ),
          },
        )}
      </Alert>
      <TextContent>
        <Text>
          {intl.formatMessage(
            {
              id: 'subwatch.lighthouse.desc',
              defaultMessage:
                'In Azure Lighthouse, deploy the Azure Resource Manager custom template that connects your Red Hat and Azure accounts. When ready, click <b>Go to Lighthouse</b> and follow these instructions:',
            },
            { b },
          )}
        </Text>
        <TextList component={TextListVariants.ol} className="pf-v5-u-ml-0">
          <TextListItem component={TextListItemVariants.li}>
            {intl.formatMessage({
              id: 'subwatch.lighthouse.selectAzureSubscription',
              defaultMessage: 'Select the Azure subscription that you want to use with RHEL management.',
            })}
          </TextListItem>
          <TextListItem component={TextListItemVariants.li}>
            {intl.formatMessage(
              {
                id: 'subwatch.lighthouse.editInstanceDetails',
                defaultMessage: 'Edit any other instance details and click <b>Review + create</b>.',
              },
              { b },
            )}
          </TextListItem>
          <TextListItem component={TextListItemVariants.li}>
            {intl.formatMessage(
              {
                id: 'subwatch.lighthouse.clickCreateToRunDeployment',
                defaultMessage:
                  'Click <b>Create</b> to run the deployment. This action creates two roles in your Azure account: {readerLink} and {roleLink}.',
              },
              {
                b,
                readerLink: (
                  <a key="reader link" href={READER_LINK} rel="noopener noreferrer" target="_blank">
                    {intl.formatMessage({
                      id: 'subwatch.lighthouse.reader',
                      defaultMessage: 'Reader',
                    })}
                  </a>
                ),
                roleLink: (
                  <a key="role link" href={ROLE_LINK} rel="noopener noreferrer" target="_blank">
                    {intl.formatMessage({
                      id: 'subwatch.lighthouse.roleLink',
                      defaultMessage: 'Managed Services Registration assignment Delete Role',
                    })}
                  </a>
                ),
              },
            )}
          </TextListItem>
          <TextListItem component={TextListItemVariants.li}>
            {intl.formatMessage(
              {
                id: 'subwatch.lighthouse.copySubscriptionId',
                defaultMessage:
                  'When the deployment is complete, click <b>Go to subscription</b> and copy the <b>Subscription ID</b>.',
              },
              { b },
            )}
          </TextListItem>
        </TextList>
      </TextContent>
      <Button
        style={{ width: 'fit-content' }}
        icon={<ExternalLinkAltIcon className="pf-v5-u-ml-md" />}
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
        {intl.formatMessage({
          id: 'subwatch.lighthouse.button',
          defaultMessage: 'Go to Lighthouse',
        })}
      </Button>
      {error}
    </>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'subwatch.subscriptionId.desc',
          defaultMessage: 'Paste your Azure subscription ID from the previous step into the field below.',
        })}
      </Text>
    </TextContent>
  );
};
