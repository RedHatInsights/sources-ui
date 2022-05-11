import React from 'react';
import render from '../../__mocks__/render';

import { screen } from '@testing-library/react';

import * as TowerCatalog from '../../../../components/addSourceWizard/hardcodedComponents/tower/catalog';

describe('Tower Catalog', () => {
  it('Auth description', () => {
    render(<TowerCatalog.AuthDescription />);

    expect(
      screen.getByText(
        'Provide Ansible Tower service account user credentials to ensure optimized availability of resources to Catalog Administrators.',
        { exact: false }
      )
    ).toBeInTheDocument();
    expect(screen.getByText('All fields are required.', { exact: false })).toBeInTheDocument();
  });

  it('Endpoint description', () => {
    render(<TowerCatalog.EndpointDescription />);

    expect(
      screen.getByText('Enter the hostname of the Ansible Tower instance you want to connect to.', { exact: false })
    ).toBeInTheDocument();
  });

  it('AllFieldsRequired', () => {
    render(<TowerCatalog.AllFieldAreRequired />);

    expect(screen.getByText('All fields are required.', { exact: false })).toBeInTheDocument();
  });
});
