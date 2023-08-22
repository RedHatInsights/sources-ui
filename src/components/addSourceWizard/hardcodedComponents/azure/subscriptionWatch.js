import React, { useEffect, useState } from 'react';
import { useIntl } from 'react-intl';

import { getSourcesApi } from '../../../../api/entities';
import useFormApi from '@data-driven-forms/react-form-renderer/use-form-api';
import {
  Button,
  ClipboardCopy,
  Text,
  TextContent,
  TextList,
  TextListItem,
  TextListVariants,
  TextVariants,
} from '@patternfly/react-core';
const API_LINK = 'https://access.redhat.com/management/api';

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
            }
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
          })
        );
      });
  }, []);

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'subwatch.lighthouse.desc',
          defaultMessage:
            "Complete configuration steps in Azure Lighthouse according to Microsoft instructions. When you're finished, return to this wizard to finish creating this Azure source.",
        })}
      </Text>
      <Button
        component="a"
        target="_blank"
        rel="noopener noreferrer"
        href={link}
        isLoading={!link}
        isDisabled={!link}
        onClick={() => {
          formOptions.change('lighthouse-clicked', true);
        }}
        isBlock
      >
        {intl.formatMessage({
          id: 'subwatch.lighthouse.button',
          defaultMessage: 'Take me to Lighthouse',
        })}
      </Button>
      {error}
    </TextContent>
  );
};

export const SubscriptionID = () => {
  const intl = useIntl();

  return (
    <TextContent>
      <Text>
        {intl.formatMessage({
          id: 'subwatch.subscriptionId.desc',
          defaultMessage:
            'Log in to your Azure account and navigate to your subscriptions. Copy the subscription ID you wish to use and paste it into the field below.',
        })}
      </Text>
    </TextContent>
  );
};
