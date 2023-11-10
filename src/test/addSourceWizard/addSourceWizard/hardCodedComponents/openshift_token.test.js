import React from 'react';
import render from '../../__mocks__/render';
import { screen } from '@testing-library/react';

import * as OpToken from '../../../../components/addSourceWizard/hardcodedComponents/openshift/token';

describe('AWS-Access key hardcoded schemas', () => {
  it('ARN DESCRIPTION is rendered correctly', () => {
    render(<OpToken.DescriptionSummary />);

    expect(
      screen.getByText('An OpenShift Container Platform login token is required to communicate with the application.', {
        exact: false,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByText('To collect data from a Red Hat OpenShift Container Platform source:', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Log in to the Red Hat OpenShift Container Platform cluster with an account that has access to the namespace',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Run the following command to obtain your login token:', { exact: false })).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue('# oc sa get-token -n management-infra management-admin');
    expect(screen.getByText('Copy the token and paste it in the Token field', { exact: false })).toBeInTheDocument();
  });
});
