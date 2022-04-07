import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentWrapperIntl } from '../../utilities/testsHelpers';
import { CLOUD_VENDOR, REDHAT_VENDOR } from '../../utilities/constants';
import TabNavigation from '../../components/TabNavigation';
import * as actions from '../../redux/sources/actions';

import mockStore from '../__mocks__/mockStore';

describe('TabNavigation', () => {
  let store;

  it('renders correctly on Cloud vendor', () => {
    store = mockStore({
      sources: {
        activeVendor: CLOUD_VENDOR,
      },
    });

    render(componentWrapperIntl(<TabNavigation />, store));

    expect(screen.getByLabelText('Red Hat Icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Cloud Icon')).toBeInTheDocument();

    expect(screen.getByText('Cloud sources').closest('.pf-m-current')).toBeInTheDocument();
    expect(screen.getByText('Red Hat sources')).toBeInTheDocument();
  });

  it('renders correctly on Red Hat vendor', () => {
    store = mockStore({
      sources: {
        activeVendor: REDHAT_VENDOR,
      },
    });

    render(componentWrapperIntl(<TabNavigation />, store));

    expect(screen.getByLabelText('Red Hat Icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Cloud Icon')).toBeInTheDocument();

    expect(screen.getByText('Cloud sources')).toBeInTheDocument();
    expect(screen.getByText('Red Hat sources').closest('.pf-m-current')).toBeInTheDocument();
  });

  it('triggers redux changed', async () => {
    actions.setActiveVendor = jest.fn().mockImplementation(() => ({ type: 'something' }));

    render(componentWrapperIntl(<TabNavigation />, store));

    expect(actions.setActiveVendor).not.toHaveBeenCalled();

    await userEvent.click(screen.getByText('Cloud sources'));

    expect(actions.setActiveVendor).toHaveBeenCalledWith(CLOUD_VENDOR);

    actions.setActiveVendor.mockClear();

    await userEvent.click(screen.getByText('Red Hat sources'));

    expect(actions.setActiveVendor).toHaveBeenCalledWith(REDHAT_VENDOR);
  });
});
