import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { screen } from '@testing-library/react';
import render from '../../__mocks__/render';

import * as ProvAwsArn from '../../../../components/addSourceWizard/hardcodedComponents/aws/provisioningArn';
import * as api from '../../../../api/entities';

describe('Provisioning AWS ARN hardcoded schemas', () => {
  it('IAM POLICY is rendered correctly', async () => {
    render(<ProvAwsArn.IAMPolicyDescription />);

    expect(
      screen.getByText(
        'Create the following AWS Identity and Access Management (IAM) policy to grant Red Hat permissions to run instances on your Amazon Web Services (AWS) Elastic Cloud (EC2).',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Log in to AWS CLI by running:', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('Create a new policy and store its ARN by running following command in your terminal.', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveDisplayValue(
      /^\s*POLICY_ARN=\$\(aws iam create-policy --policy-name RH-HCC-provisioning-policy --policy-document/
    );
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

    expect(
      screen.getByText('To delegate account access, create an IAM role and associate it with your IAM policy.', { exact: false })
    ).toBeInTheDocument();

    expect(screen.getByText('Loading configuration...')).toBeInTheDocument();

    const copyInputs = await screen.findAllByLabelText('Copyable input');

    expect(
      screen.getByText('Create a new role and add the Red Hat account as a trusted entity and fetch the role ARN:', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(copyInputs[0]).toHaveDisplayValue(/372779871274/);

    expect(screen.getByText('Attach the permissions policy that you just created.', { exact: false })).toBeInTheDocument();
    expect(copyInputs[1]).toHaveValue('aws iam attach-role-policy --role-name RH-HCC-provisioning-role --policy-arn $POLICY_ARN');
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
        'There was an error while loading the commands. Please go back and return to this step to try again.'
      )
    ).toBeInTheDocument();
  });

  it('IAM ARN is rendered correctly', async () => {
    render(<ProvAwsArn.ArnDescription />);

    expect(
      screen.getByText('To enable account access, capture the ARN associated with the role you just created.', { exact: false })
    ).toBeInTheDocument();

    expect(screen.getByText('Run', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('echo $ROLE_ARN', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('in your terminal to print the role ARN', { exact: false })).toBeInTheDocument();

    expect(screen.getByText('Copy it to the ARN field below.', { exact: false })).toBeInTheDocument();
  });
});
