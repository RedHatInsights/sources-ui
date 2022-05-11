import React from 'react';

import { screen } from '@testing-library/react';

import * as AwsAccess from '../../../../components/addSourceWizard/hardcodedComponents/aws/access_key';
import render from '../../__mocks__/render';

describe('AWS-Access key hardcoded schemas', () => {
  it('ARN DESCRIPTION is rendered correctly', () => {
    render(<AwsAccess.DescriptionSummary />);

    expect(screen.getByText('Create an access key in your AWS user account and enter the details below.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'For sufficient access and security, Red Hat recommends using the Power user identity and access management (IAM) policy for your AWS user account.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Create an access key in your AWS user account and enter the details below.')).toBeInTheDocument();
  });
});
