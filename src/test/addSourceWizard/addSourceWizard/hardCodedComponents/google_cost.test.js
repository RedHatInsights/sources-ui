import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';

import * as api from '../../../../api/entities';

import * as Cm from '../../../../components/addSourceWizard/hardcodedComponents/gcp/costManagement';
import mockedRender from '../../__mocks__/render';
import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';

describe('Cost Management Google steps components', () => {
  it('Project', () => {
    render(<Cm.Project />);

    expect(
      screen.getByText(
        'Enter the ID of a project within your Google Cloud Platform (GCP) billing account. We’ll use this project to set up your BigQuery billing export.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(screen.getByText('GCP Recommendation')).toBeInTheDocument();
    expect(screen.getByText('Create a cloud project to contain all your billing administration needs.')).toBeInTheDocument();
  });

  describe('Assign access', () => {
    it('successfully loads data', async () => {
      const email = 'super-google-email@gmail.com';

      api.getSourcesApi = () => ({
        getGoogleAccount: () =>
          Promise.resolve({
            data: [{ payload: email }],
          }),
      });

      mockedRender(<Cm.AssignAccess />);

      expect(screen.getByLabelText('Copyable input')).toHaveValue(`Loading account address...`);

      await waitFor(() => expect(screen.getByLabelText('Copyable input')).toHaveValue(email));

      expect(screen.getByText('To delegate account access, add a new member to your project.')).toBeInTheDocument();
      expect(screen.getByText('In your IAM & Admin console, navigate to', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Paste the following value into the', { exact: false })).toBeInTheDocument();
      expect(screen.getByText('Select the role you just created.')).toBeInTheDocument();
    });

    it('catches errors', async () => {
      const _cons = console.error;
      console.error = jest.fn();

      const error = 'super-google-error';

      api.getSourcesApi = () => ({
        getGoogleAccount: () => Promise.reject(error),
      });

      mockedRender(<Cm.AssignAccess />);

      expect(screen.getByLabelText('Copyable input')).toHaveValue(`Loading account address...`);

      await waitFor(() =>
        expect(screen.getByLabelText('Copyable input')).toHaveValue(
          'There is an error with loading of the account address. Please go back and return to this step.'
        )
      );

      expect(console.error).toHaveBeenCalledWith(error);

      console.error = _cons;
    });
  });

  it('Dataset', () => {
    render(
      <SourcesFormRenderer
        onSubmit={jest.fn()}
        schema={{
          fields: [
            {
              name: 'field',
              component: 'description',
              Content: Cm.Dataset,
            },
          ],
        }}
        initialValues={{
          authentication: {
            username: 'some-project-id',
          },
        }}
      />
    );

    expect(screen.getByText('some-project-id', { exact: false })).toBeInTheDocument();

    expect(
      screen.getByText('To collect and store the information needed for Cost Management, create a BigQuery dataset.', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(screen.getByText('In the BigQuery console, select your project', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('enter a name for your dataset.', { exact: false })).toBeInTheDocument();
  });

  it('Billing export', () => {
    mockedRender(<Cm.BillingExport />);

    expect(
      screen.getByText('To enable detailed billing data exports to BigQuery, set up daily cost export.', { exact: false })
    ).toBeInTheDocument();
    expect(screen.getByText('In the Billing console, click', { exact: false })).toBeInTheDocument();
    expect(
      screen.getByText('Use the dropdown menus to select the correct project and dataset.', { exact: false })
    ).toBeInTheDocument();
  });

  it('IAM Role', () => {
    render(<Cm.IAMRole />);

    expect(
      screen.getByText('To specify GCP access permissions for Red Hat, create an Identity and Access Management (IAM) role.', {
        exact: false,
      })
    ).toBeInTheDocument();
    expect(screen.getByText('From the GCP console, navigate to', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Create a new role.', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Add the following permissions to your custom role:', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('Create role.', { exact: false })).toBeInTheDocument();
  });
});
