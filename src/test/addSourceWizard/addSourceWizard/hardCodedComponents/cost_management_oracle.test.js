import React from 'react';

import { screen } from '@testing-library/react';

import * as CMOci from '.../../../../components/addSourceWizard/hardcodedComponents/oci/costManagement';
import RenderContext from '@data-driven-forms/react-form-renderer/renderer-context';
import render from '../../__mocks__/render';

describe('Cost Management Oracle steps components', () => {
  it('Configure Compartment ID', () => {
    render(<CMOci.CompartmentId fields={[]} />);

    expect(
      screen.getByText(
        'To collect and store the information needed to manage your costs, you need to first find your Global compartment-id.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('In the Oracle Cloud shell, copy and paste this command into the terminal to list your compartments')
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue('oci iam compartment list');
    expect(screen.getByText('Enter the name of the your global compartment-id (tenant-id)')).toBeInTheDocument();
  });

  it('Configure Policy Compartment', () => {
    render(
      <RenderContext.Provider
        value={{
          formOptions: {
            getState: () => ({
              values: {
                application: {
                  extra: {
                    compartment_id: 'compartment-id',
                  },
                },
              },
            }),
          },
        }}
      >
        <CMOci.PolicyCompartment fields={[]} />
      </RenderContext.Provider>
    );

    expect(
      screen.getByText(
        'In the Oracle Cloud shell, copy and paste these commands to create your cost and usage reports policy, and new cost compartment.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Create cost and usage reports policy using the following command')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Copyable input')[0]).toHaveValue(
      `oci iam policy create --compartment-id compartment-id --description "test" --name "test" --statements '["define tenancy usage-report as ocid1.tenancy.oc1..aaaaaaaaned4fkpkisbwjlr56u7cj63lf3wffbilvqknstgtvzub7vhqkggq","endorse group Administrators to read objects in tenancy usage-report"]'`
    );
    expect(screen.getByText('Create new Cost management compartment')).toBeInTheDocument();
    expect(screen.getAllByLabelText('Copyable input')[1]).toHaveValue(
      `oci iam compartment create --name cost-mgmt-compartment --compartment-id compartment-id --description 'Cost management compartment for cost and usage data'`
    );
    expect(screen.getByText('Enter the name of the your new compartment-id')).toBeInTheDocument();
  });

  it('Create Bucket', () => {
    render(
      <RenderContext.Provider
        value={{
          formOptions: {
            getState: () => ({
              values: {
                application: {
                  extra: {
                    policy_compartment: 'policy-compartment',
                  },
                },
              },
            }),
          },
        }}
      >
        <CMOci.CreateBucket fields={[]} />
      </RenderContext.Provider>
    );

    expect(
      screen.getByText(
        'Because Oracle Cloud does not allow outside access to the usage bucket, you will need to create a new bucket to copy the necessary data into.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Create a new bucket for cost and usage data with the following command')).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `oci os bucket create --name cost-management --compartment-id policy-compartment`
    );
    expect(screen.getByText('Enter the name, namespace, and region of your new data bucket')).toBeInTheDocument();
  });

  it('Populate Bucket', () => {
    render(
      <RenderContext.Provider
        value={{
          formOptions: {
            getState: () => ({
              values: {
                application: {
                  extra: {
                    compartment_id: 'compartment-id',
                  },
                },
              },
            }),
          },
        }}
      >
        <CMOci.PopulateBucket fields={[]} />
      </RenderContext.Provider>
    );

    expect(
      screen.getByText(
        'Because Oracle Cloud does not have automation scripts, you will need to create a VM to run a script that copies the necessary data to your new cost-management bucket and grant read access to Red Hat.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'In your Oracle Cloud account, create a VM and run a script similar to the one from this github repository:'
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText('https://github.com/project-koku/koku/blob/main/dev/scripts/oci_replication_func.py')
    ).toBeInTheDocument();
    expect(screen.getByText('In your Oracle Cloud shell, create this read policy for the new bucket')).toBeInTheDocument();
    expect(screen.getByLabelText('Copyable input')).toHaveValue(
      `oci iam policy create --compartment-id compartment-id --description 'Grant cost management bucket read access' --name Cost-managment-bucket-read --statements '["Define tenancy SourceTenancy as ocid1.tenancy.oc1..aaaaaaaa7bmeqn34urxue57x75fg4nlzh4w6ttjxckhaue2itbefeen2gdma","Define group StorageAdmins as ocid1.group.oc1..aaaaaaaamwx3swyherxtnvtq3vjmcflmteojw6lxf5i6bgwjygq642a2ejpa","Admit group StorageAdmins of tenancy SourceTenancy to read objects in tenancy"]'`
    );
  });
});
