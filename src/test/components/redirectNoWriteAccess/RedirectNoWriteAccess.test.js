import { Route, Routes } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import * as actions from '../../../redux/sources/actions';
import RedirectNoWriteAccess from '../../../components/RedirectNoWriteAccess/RedirectNoWriteAccess';
import { replaceRouteId, routes } from '../../../Routing';
import mockStore from '../../__mocks__/mockStore';

describe('RedirectNoWriteAccess', () => {
  let initialStore;
  let initialEntry;

  const wasRedirectedToRoot = () =>
    screen.getByTestId('location-display').textContent === '/settings/sources' + routes.sources.path;

  beforeEach(() => {
    initialEntry = [replaceRouteId(routes.sourcesRemove.path, '1')];

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'ADD_MESSAGE' }));
  });

  it('Renders null if user is admin', () => {
    initialStore = mockStore({ user: { writePermissions: true } });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<RedirectNoWriteAccess />} />
        </Routes>,
        initialStore,
        initialEntry
      )
    );

    expect(actions.addMessage).not.toHaveBeenCalled();
    expect(wasRedirectedToRoot()).toEqual(false);
  });

  it('Renders null if user has write permissions', () => {
    initialStore = mockStore({ user: { writePermissions: true } });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<RedirectNoWriteAccess />} />
        </Routes>,
        initialStore,
        initialEntry
      )
    );

    expect(actions.addMessage).not.toHaveBeenCalled();
    expect(wasRedirectedToRoot()).toEqual(false);
  });

  it('Renders null if app does not if user is admin (undefined)', () => {
    initialStore = mockStore({ user: { writePermissions: undefined } });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<RedirectNoWriteAccess />} />
        </Routes>,
        initialStore,
        initialEntry
      )
    );

    expect(actions.addMessage).not.toHaveBeenCalled();
    expect(wasRedirectedToRoot()).toEqual(false);
  });

  it('Renders redirect and creates message if user is not admin', async () => {
    initialStore = mockStore({ user: { writePermissions: false } });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<RedirectNoWriteAccess />} />
        </Routes>,
        initialStore,
        initialEntry
      )
    );
    await waitFor(() => expect(actions.addMessage).toHaveBeenCalled());
    expect(actions.addMessage).toHaveBeenCalledWith({
      title: expect.any(String),
      variant: 'danger',
      description: expect.any(String),
    });

    expect(wasRedirectedToRoot()).toEqual(true);
  });
});
