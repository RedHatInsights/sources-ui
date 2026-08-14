import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import RedirectNoPaused from '../../../components/RedirectNoPaused/RedirectNoPaused';
import { replaceRouteId, routes } from '../../../routes';
import mockStore from '../../__mocks__/mockStore';
import notificationsStore from '../../../utilities/notificationsStore';

describe('RedirectNoPaused', () => {
  let initialStore;
  let initialEntry;

  const sourceId = '123';

  const wasRedirectedToDetail = () =>
    screen.getByTestId('location-display').textContent ===
    '/settings/integrations/' + replaceRouteId(routes.sourcesDetail.path, sourceId);

  beforeEach(() => {
    initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', '546')];
  });

  it('Renders null if source is not paused', () => {
    initialStore = mockStore({
      sources: { entities: [{ id: sourceId, paused_at: null }] },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetailRemoveApp.path} element={<RedirectNoPaused />} />
        </Routes>,
        initialStore,
        initialEntry,
      ),
    );

    expect(notificationsStore.getNotifications().length).toEqual(0);
    expect(wasRedirectedToDetail()).toEqual(false);
  });

  it('Redirect to source detail when source is paused', async () => {
    initialStore = mockStore({
      sources: { entities: [{ id: sourceId, paused_at: 'today' }] },
    });

    await waitFor(() => {
      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetailRemoveApp.path} element={<RedirectNoPaused />} />
          </Routes>,
          initialStore,
          initialEntry,
        ),
      );
    });

    await waitFor(() => {
      const { id, ...notification } = notificationsStore
        .getNotifications()
        .find((notification) => notification.title === 'Integration is paused');
      expect(notification).toBeDefined();
      expect(notification).toEqual({
        description: 'You cannot perform this action on a paused integration.',
        title: 'Integration is paused',
        variant: 'danger',
      });
    });

    expect(wasRedirectedToDetail()).toEqual(true);
  });
});
