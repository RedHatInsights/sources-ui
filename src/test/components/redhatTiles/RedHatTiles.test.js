import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { routes } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';
import RedHatTiles from '../../../components/RedHatTiles/RedHatTiles';
import sourceTypes from '../../__mocks__/sourceTypesData';
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
      sources: { sourceTypes: sourceTypes.data, activeCategory: REDHAT_VENDOR },
    });
  });

  it('renders correctly', async () => {
    render(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));

    expect(screen.getByText('OpenShift Container Platform')).toBeInTheDocument();
    expect(screen.getByAltText('red hat logo')).toBeInTheDocument();
  });

  it('renders correctly when no permissions', async () => {
    store = mockStore({
      user: { writePermissions: false },
      sources: { sourceTypes: sourceTypes.data, activeCategory: REDHAT_VENDOR },
    });

    render(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));

    expect(screen.getByText('OpenShift Container Platform')).toBeInTheDocument();
    expect(screen.getByAltText('red hat logo')).toBeInTheDocument();

    await userEvent.click(screen.getByText('OpenShift Container Platform'));

    await waitFor(() =>
      expect(
        screen.getByText(
          'To perform this action, you must be granted Sources Administrator permissions from your Organization Administrator.'
        )
      ).toBeInTheDocument()
    );
  });

  it('sets openshift', async () => {
    render(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));

    await userEvent.click(screen.getByText('OpenShift Container Platform'));

    expect(screen.getByTestId('location-display').textContent).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('openshift');
  });
});
