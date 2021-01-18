import { Route, MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import RedirectNoId from '../../../components/RedirectNoId/RedirectNoId';
import * as actions from '../../../redux/sources/actions';
import * as api from '../../../api/entities';
import { routes, replaceRouteId } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';

describe('RedirectNoId', () => {
  let initialStore;
  let initialEntry;

  const wasRedirectedToRoot = (wrapper) =>
    wrapper.find(MemoryRouter).instance().history.location.pathname === routes.sources.path;

  beforeEach(() => {
    initialEntry = [replaceRouteId(routes.sourcesRemove.path, '1')];

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'ADD_MESSAGE' }));
    actions.addHiddenSource = jest.fn().mockImplementation(() => ({ type: 'ADD_HIDDEN_SOURCE' }));
  });

  it('Renders null if not loaded', () => {
    initialStore = mockStore({
      sources: { loaded: 1, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    const wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoId {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    expect(wrapper.html()).toEqual('');
  });

  it('Renders redirect and creates message if loaded and source was not found', async () => {
    let wrapper;
    api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [] }));

    initialStore = mockStore({
      sources: { loaded: 0, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoId {...args} />} />,
          initialStore,
          initialEntry
        )
      );
    });

    expect(actions.addMessage).toHaveBeenCalled();
    expect(actions.addHiddenSource).toHaveBeenCalled();

    expect(wasRedirectedToRoot(wrapper)).toEqual(true);
  });

  it('addHiddenSource is called with found source', async () => {
    const SOURCE = { id: '1', name: 'sdsadda' };

    api.doLoadSource = jest.fn().mockImplementation(() => Promise.resolve({ sources: [SOURCE] }));

    initialStore = mockStore({
      sources: { loaded: 0, appTypesLoaded: true, sourceTypesLoaded: true, entities: [] },
    });

    await act(async () => {
      mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoId {...args} />} />,
          initialStore,
          initialEntry
        )
      );
    });

    expect(actions.addHiddenSource).toHaveBeenCalledWith(SOURCE);
  });
});
