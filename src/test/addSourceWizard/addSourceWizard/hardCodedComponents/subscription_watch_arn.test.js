import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { RendererContext } from '@data-driven-forms/react-form-renderer';
import render from '../../__mocks__/render';

import * as SubsAwsArn from '../../../../components/addSourceWizard/hardcodedComponents/aws/subscriptionWatch';

describe('AWS-ARN hardcoded schemas', () => {
  it('ARN DESCRIPTION is rendered correctly', () => {
    render(<SubsAwsArn.ArnDescription />);

    expect(
      screen.getByText('To enable account access, capture the ARN associated with the role you just created.', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('Navigate to the role that you just created.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('screen, copy the role ARN and paste it in the ', { exact: false })).toBeInTheDocument();
  });

  it('IAM POLICY is rendered correctly', async () => {
    render(<SubsAwsArn.IAMPolicyDescription />);

    await waitFor(() =>
      expect(screen.getByLabelText('Copyable input')).toHaveValue(
        `{   "Version": "2012-10-17",   "Statement": [     {       "Sid": "CloudigradePolicy",       "Effect": "Allow",       "Action": [         "sts:GetCallerIdentity"       ],       "Resource": "*"     }   ] }`,
      ),
    );

    expect(
      screen.getByText(
        'To grant Red Hat access to your Amazon Web Services (AWS) subscription data, create an AWS Identity and Access Management (IAM) policy.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Log in to the', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('AWS Identity and Management (IAM) console', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('Create a new policy, pasting the following content into the JSON text box.', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('Complete the process to create your new policy.', { exact: false })).toBeInTheDocument();
  });

  it('IAM ROLE is rendered correctly with external ID', async () => {
    render(
      <RendererContext.Provider
        value={{
          formOptions: {
            getState: () => ({ values: { authentication: { extra: { external_id: '123' } } } }),
            change: () => null,
          },
        }}
      >
        <SubsAwsArn.IAMRoleDescription />
      </RendererContext.Provider>,
    );
    expect(screen.getAllByLabelText('Copyable input').at(1)).toBeInTheDocument();

    await waitFor(() => expect(screen.getAllByLabelText('Copyable input').at(0)).toHaveValue('998366406740'));

    expect(
      screen.getByText('To delegate account access, create an IAM role to associate with your IAM policy.', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('From the AWS IAM console, create a new role.', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('from the list of trusted entities and paste the following value into the', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('Attach the permissions policy that you just created.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Complete the process to create your new role.', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('You will need to be logged in to the IAM console to complete the next step', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('Do not close your browser.', { exact: false })).toBeInTheDocument();
  });
});
