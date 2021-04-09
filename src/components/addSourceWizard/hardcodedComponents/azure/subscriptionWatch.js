import React from 'react';
import { useIntl } from 'react-intl';

import { Text, TextVariants, TextContent, TextList, TextListVariants, TextListItem, ClipboardCopy } from '@patternfly/react-core';

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
      <TextList component={TextListVariants.ol} className="pf-u-ml-0">
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
      <ClipboardCopy className="pf-u-mb-lg">ansible-galaxy collection install redhatinsights.subscriptions</ClipboardCopy>
      <ClipboardCopy>
        {
          'ansible-playbook -i <AZURE_VM_HOSTNAME>, -b ~/.ansible/collections/ansible_collections/redhatinsights/subscriptions/playbooks/verify_account.yml -e rh_api_refresh_token=<OFFLINE_AUTH_TOKEN>'
        }
      </ClipboardCopy>
    </TextContent>
  );
};
