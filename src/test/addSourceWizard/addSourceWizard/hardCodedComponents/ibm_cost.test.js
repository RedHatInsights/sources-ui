import React from 'react';
import { render, screen, act } from '@testing-library/react';

import * as Cm from '../../../../components/addSourceWizard/hardcodedComponents/ibm/costManagement';
import componentWrapperIntl from '../../../../utilities/testsHelpers';

import RendererContext from '@data-driven-forms/react-form-renderer/renderer-context';

describe('Cost Management IBM steps', () => {
  it('Enteprise ID', async () => {
    await act(async () => {
      render(componentWrapperIntl(<Cm.EnterpriseId />));
    });

    expect(screen.getByText("Add the account's enterprise ID")).toBeInTheDocument();
    expect(
      screen.getByText(
        'Login to the IBM Cloud Shell and run the following command. Paste the output string into the form field below.'
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue('ibmcloud enterprise show --output JSON | jq -r .id');
  });

  it('Account ID', () => {
    render(componentWrapperIntl(<Cm.AccountId />));

    expect(screen.getByText('Add the account ID')).toBeInTheDocument();
    expect(
      screen.getByText('In the IBM Cloud Shell, run the following command. Paste the output string into the form fields below.')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue('ibmcloud account show --output JSON | jq -r .account_id');
  });

  it('Service ID', () => {
    render(componentWrapperIntl(<Cm.ServiceId />));

    expect(
      screen.getByText(
        'Create a service ID, which Cost Management will use to get billing and usage information from your account. In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.'
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      'ibmcloud iam service-id-create "Cost Management" -d "Service ID for cloud.redhat.com Cost Management" | jq -r .id'
    );
  });

  it('Configure service', () => {
    render(
      componentWrapperIntl(
        <RendererContext.Provider
          value={{
            formOptions: { getState: () => ({ values: { cost: { service_id: 'service-id' } } }) },
          }}
        >
          <Cm.ConfigureAccess />
        </RendererContext.Provider>
      )
    );

    expect(
      screen.getByText(
        'Assign policies to the service ID you just created so that Cost Management will have access to account management, billing and usage service APIs. In the IBM Cloud Shell, run the following command:'
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      'ibmcloud iam service-policy-create service-id --service-name billing  --roles Vieweribmcloud iam service-policy-create service-id --account-management --roles Vieweribmcloud iam service-policy-create service-id --service-name enterprise --roles "Usage Report Viewer"ibmcloud iam service-policy-create service-id --service-name globalcatalog  --roles Viewer'
    );
  });

  it('API key', () => {
    render(
      componentWrapperIntl(
        <RendererContext.Provider
          value={{
            formOptions: { getState: () => ({ values: { cost: { service_id: 'service-id' } } }) },
          }}
        >
          <Cm.ApiKey />
        </RendererContext.Provider>
      )
    );

    expect(
      screen.getByText('In the IBM Cloud Shell, run the following command. Paste the output string into the form field below.')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      'ibmcloud iam service-api-key-create "Cost Management API Key" service-id -d "Cost Management Service ID API Key" --output JSON | jq -r .apikey'
    );
  });
});
