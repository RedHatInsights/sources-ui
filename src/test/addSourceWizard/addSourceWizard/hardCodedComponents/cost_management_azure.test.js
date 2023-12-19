import React from 'react';

import { render, screen } from '@testing-library/react';
import RenderContext from '@data-driven-forms/react-form-renderer/renderer-context';
import Form from '@data-driven-forms/react-form-renderer/form';

import * as Cm from '.../../../../components/addSourceWizard/hardcodedComponents/azure/costManagement';
import { defaultSourcesState } from '../../../../redux/sources/reducer';
import mockedRender from '../../__mocks__/render';
import sourceTypes from '../../../__mocks__/sourceTypes';
import mockStore from '../../../__mocks__/mockStore';
import componentWrapperIntl from '../../../../utilities/testsHelpers';

const FORM_OPTIONS = {
  getState: () => ({
    values: {
      application: {
        extra: {
          storage_only: false,
        },
      },
    },
  }),
};

const FORM_OPTIONS_STORAGE_ONLY = {
  getState: () => ({
    values: {
      application: {
        extra: {
          storage_only: true,
        },
      },
    },
  }),
};

describe('Cost Management Azure steps components', () => {
  let initialState;
  let store;

  beforeEach(() => {
    initialState = {
      sources: { ...defaultSourcesState, sourceTypes, hcsEnrolled: false, hcsEnrolledLoaded: true },
    };
  });

  it('Configure Resource Group and Storage Account description', () => {
    store = mockStore(initialState);
    render(componentWrapperIntl(<Cm.ConfigureResourceGroupAndStorageAccount />, store));

    expect(
      screen.getByText(
        'Red Hat recommends creating a dedicated resource group and storage account in Azure to collect cost data and metrics for cost management.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(
      screen.getByText('After configuring a resource group and storage account in the Azure portal, enter the following:'),
    ).toBeInTheDocument();
  });

  it('Configure Resource Group and Storage Account description - HCS', () => {
    store = mockStore({ sources: { ...initialState.sources, hcsEnrolled: true } });
    render(componentWrapperIntl(<Cm.ConfigureResourceGroupAndStorageAccount />, store));

    expect(
      screen.getByText(
        'Red Hat recommends creating a dedicated resource group and storage account in Azure to collect cost data and metrics for cost management.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
    expect(
      screen.getByText('After configuring a resource group and storage account in the Azure portal, enter the following:'),
    ).toBeInTheDocument();
  });

  it('Subscription ID description', () => {
    mockedRender(<Cm.SubscriptionID />);

    expect(
      screen.getByText(
        'Run the following command in Cloud Shell to obtain the Subscription ID where the cost export is being stored and enter it below:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(`az account show --query "{ id: id }" | jq '.id' | tr -d '"'`);
  });

  it('Configure Roles description', () => {
    store = mockStore(initialState);
    render(
      componentWrapperIntl(
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
        </RenderContext.Provider>,
        store,
      ),
    );

    expect(
      screen.getByText(
        'Red Hat recommends configuring dedicated credentials to grant Cost Management read-only access to Azure cost data.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Run the following command in Cloud Shell to create a service principal with Cost Management Storage Account Contributor role. From the output enter the values in the fields below:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `az ad sp create-for-rbac -n "CostManagement" --role "Storage Account Contributor"  --scope /subscriptions/my-sub-id-1/resourceGroups/my-resource-group-1 --query '{"tenant": tenant, "client_id": appId, "secret": password}'`,
    );
  });

  it('Configure Roles description - HCS', () => {
    store = mockStore({ sources: { ...initialState.sources, hcsEnrolled: true } });
    render(
      componentWrapperIntl(
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
        </RenderContext.Provider>,
        store,
      ),
    );

    expect(
      screen.getByText(
        'Red Hat recommends configuring dedicated credentials to grant Hybrid Committed Spend read-only access to Azure cost data.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
    expect(
      screen.getByText(
        'Run the following command in Cloud Shell to create a service principal with Cost Management Storage Account Contributor role. From the output enter the values in the fields below:',
      ),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `az ad sp create-for-rbac -n "CostManagement" --role "Storage Account Contributor"  --scope /subscriptions/my-sub-id-1/resourceGroups/my-resource-group-1 --query '{"tenant": tenant, "client_id": appId, "secret": password}'`,
    );
  });

  it('Cost Read Role description', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: { extra: { subscription_id: 'my-sub-id-1', resource_group: 'my-resource-group-1' } },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(
      screen.getByText('Run the following command in Cloud Shell to create a Cost Management Reader role:'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `az role assignment create --assignee "some-user-name" --role "Cost Management Reader" --scope "/subscriptions/my-sub-id-1"`,
    );
  });

  it('Read Role description', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: {
                      extra: { subscription_id: 'my-sub-id-1', resource_group: 'my-resource-group-1', metered: 'rhel' },
                    },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(screen.getByText('Run the following command in Cloud Shell to create a Reader role:')).toBeInTheDocument();
  });

  it('Read Role description - storage only', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: {
                      extra: { subscription_id: 'my-sub-id-1', resource_group: 'my-resource-group-1', storage_only: true },
                    },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(screen.queryByText('Run the following command in Cloud Shell to create a Cost Management Reader role:')).toEqual(null);
    expect(screen.queryByText('Copyable input')).toEqual(null);
  });

  it('EA Read Role description', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: {
                      extra: {
                        subscription_id: 'my-sub-id-1',
                        resource_group: 'my-resource-group-1',
                        scope: '/providers/Microsoft.Billing/billingAccounts/1234/enrollmentAccounts/5678',
                      },
                    },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(
      screen.getByText(
        'Launch the Azure Enterprise Portal and give the service principal created above Administrator role on the associated account.',
      ),
    ).toBeInTheDocument();
  });

  it('Billing Account Read Role description', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: {
                      extra: {
                        subscription_id: 'my-sub-id-1',
                        resource_group: 'my-resource-group-1',
                        scope: '/providers/Microsoft.Billing/billingAccounts/1234',
                      },
                    },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(
      screen.getByText('Launch the Azure Portal and give the service principal created above Billing account reader role.'),
    ).toBeInTheDocument();
  });

  it('Billing Profile Read Role description', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: {
                      extra: {
                        subscription_id: 'my-sub-id-1',
                        resource_group: 'my-resource-group-1',
                        scope: '/providers/Microsoft.Billing/billingAccounts/1234/billingProfiles/5678',
                      },
                    },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(
      screen.getByText('Launch the Azure Portal and give the service principal created above Billing profile reader role.'),
    ).toBeInTheDocument();
  });

  it('Invoice Section Read Role description', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: {
                      extra: {
                        subscription_id: 'my-sub-id-1',
                        resource_group: 'my-resource-group-1',
                        scope: '/providers/Microsoft.Billing/billingAccounts/1234/invoiceSections/5678',
                      },
                    },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(
      screen.getByText('Launch the Azure Portal and give the service principal created above Invoice section reader role.'),
    ).toBeInTheDocument();
  });

  it('Read Role with scope description', () => {
    mockedRender(
      <Form onSubmit={jest.fn()}>
        {() => (
          <RenderContext.Provider
            value={{
              formOptions: {
                getState: () => ({
                  values: {
                    authentication: { username: 'some-user-name' },
                    application: {
                      extra: {
                        subscription_id: 'my-sub-id-1',
                        resource_group: 'my-resource-group-1',
                        scope: '/subscriptions/my-sub-id-1',
                      },
                    },
                  },
                }),
              },
            }}
          >
            <Cm.ReaderRoleDescription />
          </RenderContext.Provider>
        )}
      </Form>,
    );

    expect(
      screen.getByText('Run the following command in Cloud Shell to create a Cost Management Reader role:'),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `az role assignment create --assignee "some-user-name" --role "Cost Management Reader" --scope "/subscriptions/my-sub-id-1"`,
    );
  });

  it('Export Schedule description', () => {
    store = mockStore(initialState);
    render(
      componentWrapperIntl(
        <RenderContext.Provider value={{ formOptions: FORM_OPTIONS }}>
          <Cm.ExportSchedule />
        </RenderContext.Provider>,
        store,
      ),
    );

    expect(
      screen.getByText(
        'Create a recurring task to export cost data to your Azure storage account, where Cost Management will retrieve the data.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
    expect(screen.getByText('From the Azure portal, add a new cost export.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Provide a name for the container and directory path, and specify the below settings to create the daily export. Leave all other options as the default.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Export type')).toBeInTheDocument();
    expect(screen.getByText('Daily export of month-to-date costs')).toBeInTheDocument();
    expect(screen.getByText('Storage account name')).toBeInTheDocument();
    expect(screen.getByText('Created storage account name or existing storage account name')).toBeInTheDocument();
  });

  it('Export Schedule description - HCS, storageOnly', () => {
    store = mockStore({ sources: { ...initialState.sources, hcsEnrolled: true } });
    render(
      componentWrapperIntl(
        <RenderContext.Provider value={{ formOptions: FORM_OPTIONS }}>
          <Cm.ExportSchedule />
        </RenderContext.Provider>,
        store,
      ),
    );

    expect(
      screen.getByText(
        'Create a recurring task to export cost data to your Azure storage account, where Cost Management will retrieve the data.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.queryByText('Learn more')).not.toBeInTheDocument();
    expect(screen.getByText('From the Azure portal, add a new cost export.')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Provide a name for the container and directory path, and specify the below settings to create the daily export. Leave all other options as the default.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Export type')).toBeInTheDocument();
    expect(screen.getByText('Daily export of month-to-date costs')).toBeInTheDocument();
    expect(screen.getByText('Storage account name')).toBeInTheDocument();
    expect(screen.getByText('Created storage account name or existing storage account name')).toBeInTheDocument();
  });

  it('Export Scope description', () => {
    mockedRender(
      <RenderContext.Provider value={{ formOptions: FORM_OPTIONS }}>
        <Cm.ExportScopeDescription />
      </RenderContext.Provider>,
    );

    expect(
      screen.getByText(
        'From the Azure portal, select the scope for the new cost export. If there is a need to further customize the data you want to send to Red Hat, select the manually customize option to follow the special instructions on how to.',
        { exact: false },
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });

  it('Export Scope', () => {
    mockedRender(
      <RenderContext.Provider value={{ formOptions: FORM_OPTIONS }}>
        <Cm.ExportScope />
      </RenderContext.Provider>,
    );

    expect(
      screen.getByText(
        'Run the following command from the Cloud Shell to obtain the Subscription ID associated with the generated cost export.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('After running the command, enter the output in the following field:')).toBeInTheDocument();
    expect(screen.queryByText('Skip this step and proceed to next step')).toBeNull();
    expect(
      screen.queryByText(
        'Since you have chosen to manually customize the data set you want to send to Cost Management, you do not need to specify an export scope at this point and time.',
      ),
    ).toBeNull();
  });

  it('Export Scope - storage only', () => {
    mockedRender(
      <RenderContext.Provider value={{ formOptions: FORM_OPTIONS_STORAGE_ONLY }}>
        <Cm.ExportScope />
      </RenderContext.Provider>,
    );

    expect(
      screen.queryByText(
        'Run the following command from the Cloud Shell to obtain the Subscription ID associated with the generated cost export.',
      ),
    ).toBeNull();
    expect(screen.queryByText('After running the command, enter the output in the following field:')).toBeNull();
    expect(screen.getByText('Skip this step and proceed to next step')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Since you have chosen to manually customize the data set you want to send to Cost Management, you do not need to specify an export scope at this point and time.',
      ),
    ).toBeInTheDocument();
  });
});
