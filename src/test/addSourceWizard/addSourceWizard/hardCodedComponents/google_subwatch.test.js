import React from 'react';
import { screen } from '@testing-library/react';

import render from '../../__mocks__/render';

import * as SubGoogle from '../../../../components/addSourceWizard/hardcodedComponents/gcp/subscriptionWatch';

describe('Azure-Subwatch hardcoded schemas', () => {
  it('OfflineToken is rendered correctly', () => {
    render(<SubGoogle.OfflineToken />);

    expect(screen.getByText('Generate a token to authenticate the calls to APIs for Red Hat services.')).toBeInTheDocument();
    expect(screen.getByText('To obtain an offline token, follow the steps at', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('https://access.redhat.com/management/api', { selector: 'a' })).toBeInTheDocument();
  });

  it('AnsiblePlaybook is rendered correctly', () => {
    render(<SubGoogle.AnsiblePlaybook />);

    expect(screen.getByText('Download and run the following commands against a running Google Cloud VM.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('ansible-galaxy collection install redhatinsights.subscriptions')).toBeInTheDocument();
    expect(
      screen.getByDisplayValue(
        'ansible-playbook -i <GCE_VM_HOSTNAME>, -b ~/.ansible/collections/ansible_collections/redhatinsights/subscriptions/playbooks/verify_account.yml -e rh_api_refresh_token=<OFFLINE_AUTH_TOKEN>',
      ),
    ).toBeInTheDocument();
  });
});
