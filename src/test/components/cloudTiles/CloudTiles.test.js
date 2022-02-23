import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { routes } from '../../../Routes';
import CloudTiles from '../../../components/CloudTiles/CloudTiles';
import mockStore from '../../__mocks__/mockStore';
import sourceTypes, { googleType, ibmType } from '../../__mocks__/sourceTypesData';
import { CLOUD_VENDOR } from '../../../utilities/constants';

describe('CloudTiles', () => {
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
      sources: { sourceTypes: [...sourceTypes.data, googleType, ibmType], activeVendor: CLOUD_VENDOR },
    });
  });

  it('renders correctly', async () => {
    const { container } = render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    expect([...container.getElementsByClassName('pf-c-tile__title')].map((e) => e.textContent)).toEqual([
      'Amazon Web Services',
      'Google Cloud',
      'IBM Cloud',
      'Microsoft Azure',
    ]);
    expect(container.getElementsByTagName('img')).toHaveLength(4);
  });

  it('renders correctly when no permissions', async () => {
    store = mockStore({
      user: { writePermissions: false },
      sources: { sourceTypes: [...sourceTypes.data, googleType, ibmType], activeVendor: CLOUD_VENDOR },
    });

    const { container } = render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    expect([...container.getElementsByClassName('pf-c-tile__title')].map((e) => e.textContent)).toEqual([
      'Amazon Web Services',
      'Google Cloud',
      'IBM Cloud',
      'Microsoft Azure',
    ]);
    expect(container.getElementsByTagName('img')).toHaveLength(4);

    userEvent.click(screen.getByText('Google Cloud'));

    await waitFor(() =>
      expect(
        screen.getByText(
          'To perform this action, you must be granted Sources Administrator permissions from your Organization Administrator.'
        )
      ).toBeInTheDocument()
    );
  });

  it('sets amazon', async () => {
    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    userEvent.click(screen.getByText('Amazon Web Services'));

    expect(screen.getByTestId('location-display').textContent).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('amazon');
  });

  it('sets gcp', async () => {
    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    userEvent.click(screen.getByText('Google Cloud'));

    expect(screen.getByTestId('location-display').textContent).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('google');
  });

  it('sets azure', async () => {
    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    userEvent.click(screen.getByText('Microsoft Azure'));

    expect(screen.getByTestId('location-display').textContent).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('azure');
  });

  it('sets ibm', async () => {
    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    userEvent.click(screen.getByText('IBM Cloud'));

    expect(screen.getByTestId('location-display').textContent).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('ibm');
  });
});
