import { Route, MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import RedirectNoPaused from '../../../components/RedirectNoPaused/RedirectNoPaused';
import * as actions from '../../../redux/sources/actions';
import { routes, replaceRouteId } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';

describe('RedirectNoPaused', () => {
  let initialStore;
  let initialEntry;

  const sourceId = '123';

  const wasRedirectedToDetail = (wrapper) =>
    wrapper.find(MemoryRouter).instance().history.location.pathname === replaceRouteId(routes.sourcesDetail.path, sourceId);

  beforeEach(() => {
    initialEntry = [replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', '546')];

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'ADD_MESSAGE' }));
  });

  it('Renders null if source is not paused', () => {
    initialStore = mockStore({
      sources: { entities: [{ id: sourceId, paused_at: null }] },
    });

    const wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RedirectNoPaused {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    expect(wrapper.html()).toEqual('');
    expect(wasRedirectedToDetail(wrapper)).toEqual(false);
  });

  it('Redirect to source detail when source is paused', async () => {
    let wrapper;

    initialStore = mockStore({
      sources: { entities: [{ id: sourceId, paused_at: 'today' }] },
    });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetailRemoveApp.path} render={(...args) => <RedirectNoPaused {...args} />} />,
          initialStore,
          initialEntry
        )
      );
    });

    expect(actions.addMessage).toHaveBeenCalledWith({
      description: 'You cannot perform this action on a paused source.',
      title: 'Source is paused',
      variant: 'danger',
    });

    expect(wasRedirectedToDetail(wrapper)).toEqual(true);
  });
});
