import React from 'react';
import { Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourceKebab from '../../../components/SourceDetail/SourceKebab';
import mockStore from '../../__mocks__/mockStore';
import * as actions from '../../../redux/sources/actions';

describe('SourceKebab', () => {
  let store;

  const sourceId = '3627987';
  const sourceName = 'source-name-123';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceKebab {...args} />} />,
        store,
        initialEntry
      )
    );

    userEvent.click(screen.getByLabelText('Actions'));

    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Temporarily disable data collection').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(
      screen.getByText('Permanently delete this source and all collected data').closest('.src-m-dropdown-item-disabled')
    ).toBeInTheDocument();

    expect(screen.getByText('Rename').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    userEvent.hover(screen.getByText('Pause'));

    const tooltipText =
      'To perform this action, you must be granted Sources Administrator permissions from your Organization Administrator.';

    await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
  });

  it('renders correctly with paused source', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, paused_at: 'today' }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceKebab {...args} />} />,
        store,
        initialEntry
      )
    );

    userEvent.click(screen.getByLabelText('Actions'));

    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Unpause data collection for this source')).toBeInTheDocument();

    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(screen.getByText('Permanently delete this source and all collected data')).toBeInTheDocument();

    expect(screen.getByText('Rename')).toBeInTheDocument();

    userEvent.hover(screen.getByText('Rename'));

    const tooltipText = 'You cannot perform this action on a paused source.';

    await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
  });

  it('unpause source', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, paused_at: 'today', name: sourceName }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceKebab {...args} />} />,
        store,
        initialEntry
      )
    );

    userEvent.click(screen.getByLabelText('Actions'));

    actions.resumeSource = jest.fn().mockImplementation(() => ({ type: 'undefined' }));

    userEvent.click(screen.getByText('Resume'));

    expect(actions.resumeSource).toHaveBeenCalledWith(sourceId, sourceName, expect.any(Object));
  });

  describe('with permissions', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [{ id: sourceId, name: sourceName }],
        },
        user: { writePermissions: true },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceKebab {...args} />} />,
          store,
          initialEntry
        )
      );
    });

    it('renders correctly', async () => {
      userEvent.click(screen.getByLabelText('Actions'));

      expect(screen.getByText('Pause')).toBeInTheDocument();
      expect(screen.getByText('Temporarily disable data collection')).toBeInTheDocument();
      expect(screen.getByText('Pause').closest('.src-m-dropdown-item-disabled')).toBeNull();

      expect(screen.getByText('Remove')).toBeInTheDocument();
      expect(screen.getByText('Permanently delete this source and all collected data')).toBeInTheDocument();
      expect(screen.getByText('Remove').closest('.src-m-dropdown-item-disabled')).toBeNull();

      expect(screen.getByText('Rename')).toBeInTheDocument();
      expect(screen.getByText('Rename').closest('.src-m-dropdown-item-disabled')).toBeNull();
    });

    it('remove source', async () => {
      userEvent.click(screen.getByLabelText('Actions'));
      userEvent.click(screen.getByText('Remove'));

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(routes.sourcesDetailRemove.path, sourceId)
      );
    });

    it('pause source', async () => {
      userEvent.click(screen.getByLabelText('Actions'));

      actions.pauseSource = jest.fn().mockImplementation(() => ({ type: 'undefined' }));

      userEvent.click(screen.getByText('Pause'));

      expect(actions.pauseSource).toHaveBeenCalledWith(sourceId, sourceName, expect.any(Object));
    });

    it('rename source', async () => {
      userEvent.click(screen.getByLabelText('Actions'));
      userEvent.click(screen.getByText('Rename'));

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(routes.sourcesDetailRename.path, sourceId)
      );
    });
  });
});
