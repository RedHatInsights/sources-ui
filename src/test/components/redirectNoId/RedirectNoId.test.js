import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import RedirectNoId from '../../../components/RedirectNoId/RedirectNoId';
import * as actions from '../../../redux/sources/actions';
import * as api from '../../../api/entities';
import { replaceRouteId, routes } from '../../../routes';
import mockStore from '../../__mocks__/mockStore';

jest.useFakeTimers({ advanceTimers: true });

describe('RedirectNoId', () => {
  let initialStore;
  let initialEntry;

  const wasRedirectedToRoot = () =>
    screen.getByTestId('location-display').textContent === '/settings/integrations' + routes.sources.path;

  beforeEach(() => {
    initialEntry = [replaceRouteId(routes.sourcesRemove.path, '1')];

    actions.addHiddenSource = jest.fn().mockImplementation(() => ({ type: 'ADD_HIDDEN_SOURCE' }));
  });

  it('Renders null if not loaded', () => {
    initialStore = mockStore({
      sources: { loaded: 1, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<RedirectNoId />} />
        </Routes>,
        initialStore,
        initialEntry,
      ),
    );

    expect(actions.addHiddenSource).not.toHaveBeenCalled();
    expect(wasRedirectedToRoot()).toEqual(false);
  });

  it('Renders redirect if loaded and source was not found', async () => {
    api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));

    initialStore = mockStore({
      sources: { loaded: 0, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    await waitFor(() => {
      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesRemove.path} element={<RedirectNoId />} />
          </Routes>,
          initialStore,
          initialEntry,
        ),
      );
    });

    expect(actions.addHiddenSource).toHaveBeenCalled();

    await waitFor(async () => expect(wasRedirectedToRoot()).toEqual(true));
  });

  it('addHiddenSource is called with found source', async () => {
    const SOURCE = { id: '1', name: 'sdsadda' };

    api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [SOURCE] }));

    initialStore = mockStore({
      sources: { loaded: 0, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<RedirectNoId />} />
        </Routes>,
        initialStore,
        initialEntry,
      ),
    );

    await waitFor(() => expect(actions.addHiddenSource).toHaveBeenCalledWith(SOURCE));
  });
});
