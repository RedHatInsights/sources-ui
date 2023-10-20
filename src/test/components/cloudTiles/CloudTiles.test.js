import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { routes } from '../../../Routing';
import CloudTiles from '../../../components/CloudTiles/CloudTiles';
import mockStore from '../../__mocks__/mockStore';
import sourceTypes from '../../__mocks__/sourceTypes';
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
      sources: { sourceTypes, activeCategory: CLOUD_VENDOR },
    });
  });

  it('renders correctly', async () => {
    const { container } = render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    expect([...container.getElementsByClassName('pf-v5-c-tile__title')].map((e) => e.textContent)).toEqual([
      'Amazon Web Services',
      'Google Cloud',
      'IBM Cloud',
      'Microsoft Azure',
      'Oracle Cloud Infrastructure',
    ]);
    expect(container.getElementsByTagName('img')).toHaveLength(5);
  });

  it('renders correctly when no permissions', async () => {
    const user = userEvent.setup();

    store = mockStore({
      user: { writePermissions: false },
      sources: { sourceTypes, activeCategory: CLOUD_VENDOR },
    });

    const { container } = render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    expect([...container.getElementsByClassName('pf-v5-c-tile__title')].map((e) => e.textContent)).toEqual([
      'Amazon Web Services',
      'Google Cloud',
      'IBM Cloud',
      'Microsoft Azure',
      'Oracle Cloud Infrastructure',
    ]);
    expect(container.getElementsByTagName('img')).toHaveLength(5);

    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          'To perform this action, your Organization Administrator must grant you Sources Administrator permissions.'
        )
      ).toBeInTheDocument()
    );
  });

  it('sets amazon', async () => {
    const user = userEvent.setup();

    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    await waitFor(async () => {
      await user.click(screen.getByText('Amazon Web Services'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(`/settings/integrations/${routes.sourcesNew.path}`);
    expect(setSelectedType).toHaveBeenCalledWith('amazon');
  });

  it('sets gcp', async () => {
    const user = userEvent.setup();

    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    await waitFor(async () => {
      await user.click(screen.getByText('Google Cloud'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(`/settings/integrations/${routes.sourcesNew.path}`);
    expect(setSelectedType).toHaveBeenCalledWith('google');
  });

  it('sets azure', async () => {
    const user = userEvent.setup();

    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    await waitFor(async () => {
      await user.click(screen.getByText('Microsoft Azure'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(`/settings/integrations/${routes.sourcesNew.path}`);
    expect(setSelectedType).toHaveBeenCalledWith('azure');
  });

  it('sets ibm', async () => {
    const user = userEvent.setup();

    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    await waitFor(async () => {
      await user.click(screen.getByText('IBM Cloud'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(`/settings/integrations/${routes.sourcesNew.path}`);
    expect(setSelectedType).toHaveBeenCalledWith('ibm');
  });

  it('sets oracle', async () => {
    const user = userEvent.setup();

    render(componentWrapperIntl(<CloudTiles {...initialProps} />, store));

    await waitFor(async () => {
      await user.click(screen.getByText('Oracle Cloud Infrastructure'));
    });

    expect(screen.getByTestId('location-display').textContent).toEqual(`/settings/integrations/${routes.sourcesNew.path}`);
    expect(setSelectedType).toHaveBeenCalledWith('oracle-cloud-infrastructure');
  });
});
