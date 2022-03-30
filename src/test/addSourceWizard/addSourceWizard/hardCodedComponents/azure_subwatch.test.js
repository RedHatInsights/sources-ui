import React from 'react';
import { screen } from '@testing-library/react';

import render from '../../__mocks__/render';

import * as SubAzure from '../../../../components/addSourceWizard/hardcodedComponents/azure/subscriptionWatch';

describe('Azure-Subwatch hardcoded schemas', () => {
  it('OfflineToken is rendered correctly', () => {
    render(<SubAzure.OfflineToken />);

    expect(screen.getByText('Generate a token to authenticate the calls to APIs for Red Hat services.')).toBeInTheDocument();
    expect(screen.getByText('To obtain an offline token, follow the steps at', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('https://access.redhat.com/management/api', { selector: 'a' })).toBeInTheDocument();
  });

  it('AnsiblePlaybook is rendered correctly', () => {
    render(<SubAzure.AnsiblePlaybook />);

    expect(screen.getByText('Download and run the following commands against a running Azure VM.')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Copyable input')[0]).toHaveValue(
      'ansible-galaxy collection install redhatinsights.subscriptions'
    );
    expect(screen.getAllByLabelText('Copyable input')[1]).toHaveValue(
      'ansible-playbook -i <AZURE_VM_HOSTNAME>, -b ~/.ansible/collections/ansible_collections/redhatinsights/subscriptions/playbooks/verify_account.yml -e rh_api_refresh_token=<OFFLINE_AUTH_TOKEN>'
    );
  });
});
