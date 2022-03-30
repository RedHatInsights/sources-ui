import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import render from '../../__mocks__/render';

import * as SubsAwsArn from '../../../../components/addSourceWizard/hardcodedComponents/aws/subscriptionWatch';
import * as api from '../../../../api/subscriptionWatch';

describe('AWS-ARN hardcoded schemas', () => {
  it('ARN DESCRIPTION is rendered correctly', () => {
    render(<SubsAwsArn.ArnDescription />);

    expect(
      screen.getByText('To enable account access, capture the ARN associated with the role you just created.', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('Navigate to the role that you just created.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('screen, copy the role ARN and paste it in the ', { exact: false })).toBeInTheDocument();
  });

  it('IAM POLICY is rendered correctly', async () => {
    const IAM_POLICY = { version: '1234' };
    const CONFIG = { some: 'fake', config: 'oh yeah', aws_policies: { traditional_inspection: IAM_POLICY } };
    api.getSubWatchConfig = jest.fn().mockImplementation(() => Promise.resolve(CONFIG));

    render(<SubsAwsArn.IAMPolicyDescription />);

    expect(screen.getByLabelText('Copyable input')).toHaveValue(`Loading configuration...`);

    await waitFor(() => expect(screen.getByLabelText('Copyable input')).toHaveValue(`{  "version": "1234"}`));

    expect(
      screen.getByText(
        'To grant Red Hat access to your Amazon Web Services (AWS) subscription data, create an AWS Identity and Access Management (IAM) policy.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Log in to the', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('AWS Identity and Management (IAM) console', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('Create a new policy, pasting the following content into the JSON text box.', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('Complete the process to create your new policy.', { exact: false })).toBeInTheDocument();
  });

  it('IAM POLICY is rendered correctly with error', async () => {
    const _cons = console.error;
    console.error = jest.fn();

    const ERROR = 'Something went wrong';
    api.getSubWatchConfig = jest.fn().mockImplementation(() => Promise.reject(ERROR));

    render(<SubsAwsArn.IAMPolicyDescription />);

    expect(screen.getByLabelText('Copyable input')).toHaveValue(`Loading configuration...`);

    await waitFor(() =>
      expect(screen.getByLabelText('Copyable input')).toHaveValue(
        JSON.stringify('There is an error with loading of the configuration. Please go back and return to this step.', null, 2)
      )
    );

    expect(console.error).toHaveBeenCalledWith(ERROR);

    console.error = _cons;
  });

  it('IAM ROLE is rendered correctly', async () => {
    const CM_ID = '372779871274';
    const CONFIG = { aws_account_id: CM_ID };
    api.getSubWatchConfig = jest.fn().mockImplementation(() => Promise.resolve(CONFIG));

    render(<SubsAwsArn.IAMRoleDescription />);

    expect(screen.getByLabelText('Copyable input')).toHaveValue(`Loading configuration...`);

    await waitFor(() => expect(screen.getByLabelText('Copyable input')).toHaveValue(CM_ID));

    expect(
      screen.getByText('To delegate account access, create an IAM role to associate with your IAM policy.', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('From the AWS IAM console, create a new role.', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('from the list of trusted entities and paste the following value into the', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('Attach the permissions policy that you just created.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Complete the process to create your new role.', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('You will need to be logged in to the IAM console to complete the next step', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('Do not close your browser.', { exact: false })).toBeInTheDocument();
  });

  it('IAM ROLE is rendered correctly with error', async () => {
    const _cons = console.error;
    console.error = jest.fn();

    const ERROR = 'Something went wrong';
    api.getSubWatchConfig = jest.fn().mockImplementation(() => Promise.reject(ERROR));

    render(<SubsAwsArn.IAMRoleDescription />);

    expect(screen.getByLabelText('Copyable input')).toHaveValue(`Loading configuration...`);

    await waitFor(() =>
      expect(screen.getByLabelText('Copyable input')).toHaveValue(
        'There is an error with loading of the configuration. Please go back and return to this step.'
      )
    );
    expect(console.error).toHaveBeenCalledWith(ERROR);
    console.error = _cons;
  });
});
