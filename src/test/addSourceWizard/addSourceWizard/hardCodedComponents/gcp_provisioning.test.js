import React from 'react';
import MockAdapter from 'axios-mock-adapter';
import { screen } from '@testing-library/react';
import render from '../../__mocks__/render';
import * as useFormApi from '@data-driven-forms/react-form-renderer/use-form-api/use-form-api';
import * as ProvGCP from '../../../../components/addSourceWizard/hardcodedComponents/gcp/provisioning';
import * as api from '../../../../api/entities';

describe('Provisioning GCP hardcoded schemas', () => {
  const MOCKED_USERNAME = 'mocked-username';
  const getState = jest.fn(() => ({
    values: {
      authentication: {
        username: MOCKED_USERNAME,
      },
    },
  }));

  jest.spyOn(useFormApi, 'default').mockImplementation(() => ({
    getState,
  }));

  it('ADD ROLE is rendered correctly', async () => {
    const appId = '11';
    const gcpServiceAccount = 'example@red-hat-hcc.iam.gserviceaccount.com';

    const mock = new MockAdapter(api.axiosInstance);
    mock
      .onGet(`/api/sources/v3.1/application_types?filter[name]=/insights/platform/provisioning`)
      .reply(200, { data: [{ id: appId }] });
    mock
      .onGet(`/api/sources/v3.1/app_meta_data?filter[name]=gcp_service_account&application_type_id=${appId}`)
      .reply(200, { data: [{ payload: gcpServiceAccount }] });

    render(<ProvGCP.ConnectGCP />);

    expect(screen.getByText('Loading configuration...')).toBeInTheDocument();

    expect(
      await screen.findByText('To delegate account access, create a custom role and grant it to Red Hat service account.', {
        exact: false,
      }),
    ).toBeInTheDocument();

    const cloudShellURL = `https://console.cloud.google.com/cloudshell/editor?project=${MOCKED_USERNAME}&cloudshell=true&shellonly=true`;
    const button = await screen.findByText('Connect Google Cloud');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('href', cloudShellURL);
  });

  it('ADD ROLE is rendered correctly with error', async () => {
    const mock = new MockAdapter(api.axiosInstance);
    mock
      .onGet(`/api/sources/v3.1/application_types?filter[name]=/insights/platform/provisioning`)
      .reply(500, { errors: [{ detail: 'error details' }] });

    render(<ProvGCP.ConnectGCP />);

    expect(screen.getByText('Loading configuration...')).toBeInTheDocument();

    expect(
      await screen.findByText(
        'There was an error while loading the commands. Please go back and return to this step to try again.',
      ),
    ).toBeInTheDocument();
  });

  it('PROJECT ID is rendered correctly', async () => {
    render(<ProvGCP.ProjectID />);

    expect(screen.getByText('Login to Google Cloud Plattform and Copy your project ID', { exact: false })).toBeInTheDocument();

    expect(screen.getByText('Project ID', { exact: false })).toBeInTheDocument();
  });
});
