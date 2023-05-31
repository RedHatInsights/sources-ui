import React from 'react';
import { screen } from '@testing-library/react';

import EditLink from '../../../components/addSourceWizard/EditLink';
import render from '../__mocks__/render';

import * as useChrome from '@redhat-cloud-services/frontend-components/useChrome';
// need this to override the global mock
jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return {
    __esModule: true,
    default: () => ({}),
  };
});

describe('EditLink', () => {
  let id;

  beforeEach(() => {
    id = 'some-id';
  });

  it('renders on sources', () => {
    jest.spyOn(useChrome, 'default').mockImplementationOnce(() => ({
      getApp: () => 'sources',
      isBeta: () => true,
    }));
    render(<EditLink id={id} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/settings/sources/detail/some-id');
  });

  it('renders on other app', () => {
    jest.spyOn(useChrome, 'default').mockImplementationOnce(() => ({
      getApp: () => 'cost-management',
      isBeta: () => true,
    }));

    render(<EditLink id={id} />);

    expect(screen.getByRole('link')).toHaveAttribute('href', '/preview/settings/sources/detail/some-id');
  });
});
