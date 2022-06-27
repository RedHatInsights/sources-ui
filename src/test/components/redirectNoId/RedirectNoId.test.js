import { Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import RedirectNoId from '../../../components/RedirectNoId/RedirectNoId';
import * as actions from '../../../redux/sources/actions';
import * as api from '../../../api/entities';
import { replaceRouteId, routes } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';

describe('RedirectNoId', () => {
  let initialStore;
  let initialEntry;

  const wasRedirectedToRoot = () => screen.getByTestId('location-display').textContent === routes.sources.path;

  beforeEach(() => {
    initialEntry = [replaceRouteId(routes.sourcesRemove.path, '1')];

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'ADD_MESSAGE' }));
    actions.addHiddenSource = jest.fn().mockImplementation(() => ({ type: 'ADD_HIDDEN_SOURCE' }));
  });

  it('Renders null if not loaded', () => {
    initialStore = mockStore({
      sources: { loaded: 1, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoId {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    expect(actions.addMessage).not.toHaveBeenCalled();
    expect(actions.addHiddenSource).not.toHaveBeenCalled();
    expect(wasRedirectedToRoot()).toEqual(false);
  });

  it('Renders redirect and creates message if loaded and source was not found', async () => {
    api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));

    initialStore = mockStore({
      sources: { loaded: 0, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoId {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    await waitFor(() => expect(actions.addMessage).toHaveBeenCalled());
    expect(actions.addHiddenSource).toHaveBeenCalled();

    expect(wasRedirectedToRoot()).toEqual(true);
  });

  it('addHiddenSource is called with found source', async () => {
    const SOURCE = { id: '1', name: 'sdsadda' };

    api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [SOURCE] }));

    initialStore = mockStore({
      sources: { loaded: 0, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoId {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    await waitFor(() => expect(actions.addHiddenSource).toHaveBeenCalledWith(SOURCE));
  });
});
