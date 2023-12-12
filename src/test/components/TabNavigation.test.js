import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentWrapperIntl } from '../../utilities/testsHelpers';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/constants';
import TabNavigation from '../../components/TabNavigation';
import * as actions from '../../redux/sources/actions';

import mockStore from '../__mocks__/mockStore';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => {
  return () => ({ getEnvironment: () => 'bar', isBeta: () => false });
});

describe('TabNavigation', () => {
  let store;

  it('renders correctly on Cloud Category', () => {
    store = mockStore({
      sources: {
        activeCategory: CLOUD_VENDOR,
      },
      user: { isOrgAdmin: true },
    });

    render(componentWrapperIntl(<TabNavigation />, store));

    expect(screen.getByLabelText('Red Hat Icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Cloud Icon')).toBeInTheDocument();

    expect(screen.getByText('Cloud sources').closest('.pf-m-current')).toBeInTheDocument();
    expect(screen.getByText('Red Hat sources')).toBeInTheDocument();
  });

  it('renders correctly on Red Hat Category', () => {
    store = mockStore({
      sources: {
        activeCategory: REDHAT_VENDOR,
      },
      user: { isOrgAdmin: true },
    });

    render(componentWrapperIntl(<TabNavigation />, store));

    expect(screen.getByLabelText('Red Hat Icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Cloud Icon')).toBeInTheDocument();

    expect(screen.getByText('Cloud sources')).toBeInTheDocument();
    expect(screen.getByText('Red Hat sources').closest('.pf-m-current')).toBeInTheDocument();
  });

  it('triggers redux changed', async () => {
    store = mockStore({
      sources: {
        activeCategory: CLOUD_VENDOR,
      },
      user: { isOrgAdmin: true },
    });
    const user = userEvent.setup();

    actions.setActiveCategory = jest.fn().mockImplementation(() => ({ type: 'something' }));

    render(componentWrapperIntl(<TabNavigation />, store));

    expect(actions.setActiveCategory).not.toHaveBeenCalled();

    await user.click(screen.getByText('Cloud sources'));

    expect(actions.setActiveCategory).toHaveBeenCalledWith(CLOUD_VENDOR);

    actions.setActiveCategory.mockClear();

    await user.click(screen.getByText('Red Hat sources'));

    expect(actions.setActiveCategory).toHaveBeenCalledWith(REDHAT_VENDOR);
  });
});
