import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { screen } from '@testing-library/react';
import render from '../../__mocks__/render';

import * as ProvAwsArn from '../../../../components/addSourceWizard/hardcodedComponents/aws/provisioningArn';
import * as api from '../../../../api/entities';

describe('Provisioning AWS ARN hardcoded schemas', () => {
  it('AccountNumber is rendered correctly', async () => {
    render(<ProvAwsArn.AccountNumber />);
    expect(screen.getByText('Login to your AWS account and copy your account number')).toBeInTheDocument();
  });

  it('IAM ROLE is rendered correctly', async () => {
    const appId = '11';
    const awsAccId = '372779871274';

    const mock = new MockAdapter(api.axiosInstance);
    mock
      .onGet(`/api/sources/v3.1/application_types?filter[name]=/insights/platform/provisioning`)
      .reply(200, { data: [{ id: appId }] });
    mock
      .onGet(`/api/sources/v3.1/app_meta_data?filter[name]=aws_wizard_account_number&application_type_id=${appId}`)
      .reply(200, { data: [{ payload: awsAccId }] });

    render(<ProvAwsArn.IAMRoleDescription />);

    expect(screen.getByText('Loading configuration...')).toBeInTheDocument();
    const button = await screen.findByText('Connect AWS');
    expect(button).toBeInTheDocument();
    const StackCreationURL = `https://console.aws.amazon.com/cloudformation/home#/stacks/quickcreate?templateURL=https://provisioning-public-assets.s3.amazonaws.com/AWSStack/provisioning.yml&stackName=RH-HCC-provisioning-stack&param_RoleName=RH-HCC-provisioning-role&param_ProvisioningAwsAccount=${awsAccId}&param_PolicyName=RH-HCC-provisioning-policy`;
    expect(button).toHaveAttribute('href', StackCreationURL);
  });

  it('IAM ROLE is rendered correctly with error', async () => {
    const mock = new MockAdapter(api.axiosInstance);
    mock
      .onGet(`/api/sources/v3.1/application_types?filter[name]=/insights/platform/provisioning`)
      .reply(500, { errors: [{ detail: 'error details' }] });

    render(<ProvAwsArn.IAMRoleDescription />);

    expect(screen.getByText('Loading configuration...')).toBeInTheDocument();

    expect(
      await screen.findByText(
        'There was an error while loading the commands. Please go back and return to this step to try again.',
      ),
    ).toBeInTheDocument();
  });
});
