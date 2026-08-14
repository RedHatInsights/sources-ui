import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { replaceRouteId, routes } from '../../../routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';
import PauseAlert from '../../../components/SourceDetail/PauseAlert';
import * as actions from '../../../redux/sources/actions';

describe('DetailHeader', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this integration', paused_at: 'today' }],
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<PauseAlert />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByText('Default alert:')).toBeInTheDocument();
    expect(screen.getByText('Integration paused')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No data is being collected for this integration. Turn the integration back on to reestablish connection and data collection. Previous credentials will be restored and application connections will continue as seen on this page.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Resume connection').closest('button')).toBeDisabled();
  });

  it('renders with permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this integration', paused_at: 'today' }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<PauseAlert />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByText('Default alert:')).toBeInTheDocument();
    expect(screen.getByText('Integration paused')).toBeInTheDocument();
    expect(
      screen.getByText(
        'No data is being collected for this integration. Turn the integration back on to reestablish connection and data collection. Previous credentials will be restored and application connections will continue as seen on this page.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Resume connection')).not.toBeDisabled();
  });

  it('resume source', async () => {
    const user = userEvent.setup();

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this integration', paused_at: 'today' }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<PauseAlert />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    actions.resumeSource = jest.fn().mockImplementation(() => ({ type: 'mock-resume-source' }));

    await waitFor(async () => {
      await user.click(screen.getByText('Resume connection'));
    });

    await waitFor(() =>
      expect(actions.resumeSource).toHaveBeenCalledWith(sourceId, 'Name of this integration', expect.any(Object)),
    );

    const calledActions = store.getActions();
    expect(calledActions[calledActions.length - 1]).toEqual({ type: 'mock-resume-source' });
  });
});
