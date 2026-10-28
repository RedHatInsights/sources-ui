import React from 'react';
import { defineMessages, useIntl } from 'react-intl';

import { ClipboardCopy, Content, ContentVariants } from '@patternfly/react-core';

const ANSIBLE_INSTALL_CMD = 'ansible-galaxy collection install redhatinsights.subscriptions';
const ANSIBLE_VERIFY_CMD =
  'ansible-playbook -i <GCE_VM_HOSTNAME>, -b ~/.ansible/collections/ansible_collections/redhatinsights/subscriptions/playbooks/verify_account.yml -e rh_api_refresh_token=<OFFLINE_AUTH_TOKEN>';

const messages = defineMessages({
  subwatchGoogleTokendesc: {
    id: 'subwatch.google.tokenDesc',
    defaultMessage: 'Generate a token to authenticate the calls to APIs for Red Hat services.',
  },
  subwatchGoogleTokenlink: {
    id: 'subwatch.google.tokenLink',
    defaultMessage: 'To obtain an offline token, follow the steps at {link}.',
  },
  subwatchGoogleAnsibleplaybookdesc: {
    id: 'subwatch.google.ansiblePlaybookDesc',
    defaultMessage: 'Download and run the following commands against a running Google Cloud VM.',
  },
});

const API_LINK = 'https://access.redhat.com/management/api';

export const OfflineToken = () => {
  const intl = useIntl();

  return (
    <Content>
      <Content component="p">{intl.formatMessage(messages.subwatchGoogleTokendesc)}</Content>
      <Content component={ContentVariants.ol} className="pf-v6-u-ml-0">
        <Content component="li">
          {intl.formatMessage(messages.subwatchGoogleTokenlink, {
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
      <Content component={ContentVariants.p}>{intl.formatMessage(messages.subwatchGoogleAnsibleplaybookdesc)}</Content>
      <ClipboardCopy className="pf-v6-u-mb-lg">{ANSIBLE_INSTALL_CMD}</ClipboardCopy>
      <ClipboardCopy variant="expansion">{ANSIBLE_VERIFY_CMD}</ClipboardCopy>
    </Content>
  );
};
