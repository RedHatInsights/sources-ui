import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { routes } from '../../../Routing';
import mockStore from '../../__mocks__/mockStore';
import RedHatTiles from '../../../components/RedHatTiles/RedHatTiles';
import sourceTypes from '../../__mocks__/sourceTypes';
import { REDHAT_VENDOR } from '../../../utilities/constants';

describe('RedhatTiles', () => {
  let setSelectedType;
  let initialProps;
  let store;

  beforeEach(() => {
    setSelectedType = jest.fn();

    initialProps = {
      setSelectedType,
    };

    store = mockStore({
      user: { writePermissions: true },
      sources: { sourceTypes, activeCategory: REDHAT_VENDOR },
    });
  });

  it('renders correctly', async () => {
    render(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));

    expect(screen.getByText('OpenShift Container Platform')).toBeInTheDocument();
    expect(screen.getByAltText('red hat logo')).toBeInTheDocument();
  });

  it('renders correctly when no permissions', async () => {
    const user = userEvent.setup();

    store = mockStore({
      user: { writePermissions: false },
      sources: { sourceTypes, activeCategory: REDHAT_VENDOR },
    });

    render(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));

    expect(screen.getByText('OpenShift Container Platform')).toBeInTheDocument();
    expect(screen.getByAltText('red hat logo')).toBeInTheDocument();

    await user.click(screen.getByText('OpenShift Container Platform'));

    await waitFor(() =>
      expect(
        screen.getByText(
          'To perform this action, your Organization Administrator must grant you Sources Administrator permissions.'
        )
      ).toBeInTheDocument()
    );
  });

  it('sets openshift', async () => {
    const user = userEvent.setup();

    render(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));

    await user.click(screen.getByText('OpenShift Container Platform'));

    expect(screen.getByTestId('location-display').textContent).toEqual(`/settings/sources/${routes.sourcesNew.path}`);
    expect(setSelectedType).toHaveBeenCalledWith('openshift');
  });
});
