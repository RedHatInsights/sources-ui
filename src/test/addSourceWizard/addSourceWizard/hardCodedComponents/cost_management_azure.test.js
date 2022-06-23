import React from 'react';

import { screen } from '@testing-library/react';

import * as Cm from '.../../../../components/addSourceWizard/hardcodedComponents/azure/costManagement';
import RenderContext from '@data-driven-forms/react-form-renderer/renderer-context';
import Form from '@data-driven-forms/react-form-renderer/form';
import render from '../../__mocks__/render';

describe('Cost Management Azure steps components', () => {
  it('Configure Resource Group and Storage Account description', () => {
    render(<Cm.ConfigureResourceGroupAndStorageAccount />);

    expect(
      screen.getByText(
        'Red Hat recommends creating a dedicated resource group and storage account in Azure to collect cost data and metrics for cost management.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(
      screen.getByText('After configuring a resource group and storage account in the Azure portal, enter the following:')
    ).toBeInTheDocument();
  });

  it('Subscription ID description', () => {
    render(<Cm.SubscriptionID />);

    expect(
      screen.getByText('Run the following command in Cloud Shell to obtain your Subscription ID and enter it below:')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue('az account show --query "{ subscription_id: id }"');
  });

  it('Configure Roles description', () => {
    render(
      <RenderContext.Provider
        value={{
          formOptions: {
            getState: () => ({
              values: { application: { extra: { subscription_id: 'my-sub-id-1', resource_group: 'my-resource-group-1' } } },
            }),
          },
        }}
      >
        <Cm.ConfigureRolesDescription />
      </RenderContext.Provider>
    );

    expect(
      screen.getByText(
        'Red Hat recommends configuring dedicated credentials to grant Cost Management read-only access to Azure cost data.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Run the following command in Cloud Shell to create a Cost Management Storage Account Contributor role. From the output enter the values in the fields below:'
      )
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `az ad sp create-for-rbac -n "CostManagement" --role "Storage Account Contributor"  --scope /subscriptions/my-sub-id-1/resourceGroups/my-resource-group-1 --query '{"tenant": tenant, "client_id": appId, "secret": password}'`
    );
  });

  it('Read Role description', () => {
    render(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: { getState: () => ({ values: { authentication: { username: 'some-user-name' } } }) },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>
    );

    expect(
      screen.getByText('Run the following command in Cloud Shell to create a Cost Management Reader role:')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `az role assignment create --assignee "some-user-name" --role "Cost Management Reader"`
    );
  });

  it('Export Schedule description', () => {
    render(<Cm.ExportSchedule />);

    expect(
      screen.getByText(
        'Create a recurring task to export cost data to your Azure storage account, where Cost Management will retrieve the data.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(screen.getByText('From the Azure portal, add a new export.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Provide a name for the container and directory path, and specify the below settings to create the daily export. Leave all other options as the default.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Export type')).toBeInTheDocument();
    expect(screen.getByText('Daily export for billing-period-to-date costs')).toBeInTheDocument();
    expect(screen.getByText('Storage account name')).toBeInTheDocument();
    expect(screen.getByText('Storage account name created earlier')).toBeInTheDocument();
  });
});
