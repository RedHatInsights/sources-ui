import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { replaceRouteId, routes } from '../../../Routing';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourceKebab from '../../../components/SourceDetail/SourceKebab';
import mockStore from '../../__mocks__/mockStore';
import * as actions from '../../../redux/sources/actions';

jest.mock('@patternfly/react-core/dist/js/components/Tooltip', () => {
  const lib = jest.requireActual('@patternfly/react-core/dist/js/components/Tooltip');
  const { Tooltip } = jest.requireActual('../../__mocks__/@patternfly/react-core');

  return {
    ...lib,
    Tooltip,
  };
});

describe('SourceKebab', () => {
  let store;

  const sourceId = '3627987';
  const sourceName = 'source-name-123';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    const user = userEvent.setup();

    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceKebab />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Actions'));
    });

    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Temporarily disable data collection').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(
      screen.getByText('Permanently delete this integration and all collected data').closest('.src-m-dropdown-item-disabled'),
    ).toBeInTheDocument();

    expect(screen.getByText('Rename').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    await waitFor(async () => {
      await user.hover(screen.getByText('Pause'));
    });

    const tooltipText =
      'To perform this action, your Organization Administrator must grant you Cloud Administrator permissions.';

    await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
  });

  it('renders with no permissions as org admin', async () => {
    const user = userEvent.setup();

    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { writePermissions: false, isOrgAdmin: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceKebab />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Actions'));
    });
    await waitFor(async () => {
      await user.hover(screen.getByText('Pause'));
    });

    const tooltipText = 'To perform this action, you must add Cloud Administrator permissions to your user.';

    await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
  });

  it('renders correctly with paused source', async () => {
    const user = userEvent.setup();

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, paused_at: 'today' }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceKebab />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Actions'));
    });

    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Unpause data collection for this integration')).toBeInTheDocument();

    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(screen.getByText('Permanently delete this integration and all collected data')).toBeInTheDocument();

    expect(screen.getByText('Rename')).toBeInTheDocument();

    await waitFor(async () => {
      await user.hover(screen.getByText('Rename'));
    });

    const tooltipText = 'You cannot perform this action on a paused integration.';

    await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
  });

  it('unpause source', async () => {
    const user = userEvent.setup();

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, paused_at: 'today', name: sourceName }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<SourceKebab />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Actions'));
    });

    actions.resumeSource = jest.fn().mockImplementation(() => ({ type: 'undefined' }));

    await waitFor(async () => {
      await user.click(screen.getByText('Resume'));
    });

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
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<SourceKebab />} />
          </Routes>,
          store,
          initialEntry,
        ),
      );
    });

    it('renders correctly', async () => {
      const user = userEvent.setup();

      await waitFor(async () => {
        await user.click(screen.getByLabelText('Actions'));
      });

      expect(screen.getByText('Pause')).toBeInTheDocument();
      expect(screen.getByText('Temporarily disable data collection')).toBeInTheDocument();
      expect(screen.getByText('Pause').closest('.src-m-dropdown-item-disabled')).toBeNull();

      expect(screen.getByText('Remove')).toBeInTheDocument();
      expect(screen.getByText('Permanently delete this integration and all collected data')).toBeInTheDocument();
      expect(screen.getByText('Remove').closest('.src-m-dropdown-item-disabled')).toBeNull();

      expect(screen.getByText('Rename')).toBeInTheDocument();
      expect(screen.getByText('Rename').closest('.src-m-dropdown-item-disabled')).toBeNull();
    });

    it('remove source', async () => {
      const user = userEvent.setup();

      await waitFor(async () => {
        await user.click(screen.getByLabelText('Actions'));
      });
      await waitFor(async () => {
        await user.click(screen.getByText('Remove'));
      });

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(`/settings/integrations/${routes.sourcesDetailRemove.path}`, sourceId),
      );
    });

    it('pause source', async () => {
      const user = userEvent.setup();

      await waitFor(async () => {
        await user.click(screen.getByLabelText('Actions'));
      });

      actions.pauseSource = jest.fn().mockImplementation(() => ({ type: 'undefined' }));

      await waitFor(async () => {
        await user.click(screen.getByText('Pause'));
      });

      expect(actions.pauseSource).toHaveBeenCalledWith(sourceId, sourceName, expect.any(Object));
    });

    it('rename source', async () => {
      const user = userEvent.setup();

      await waitFor(async () => {
        await user.click(screen.getByLabelText('Actions'));
      });
      await waitFor(async () => {
        await user.click(screen.getByText('Rename'));
      });

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(`/settings/integrations/${routes.sourcesDetailRename.path}`, sourceId),
      );
    });
  });
});
