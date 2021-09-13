import { Route, MemoryRouter } from 'react-router-dom';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import * as actions from '../../../redux/sources/actions';
import RedirectNoWriteAccess from '../../../components/RedirectNoWriteAccess/RedirectNoWriteAccess';
import { routes, replaceRouteId } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';

describe('RedirectNoWriteAccess', () => {
  let initialStore;
  let initialEntry;

  const wasRedirectedToRoot = (wrapper) =>
    wrapper.find(MemoryRouter).instance().history.location.pathname === routes.sources.path;

  beforeEach(() => {
    initialEntry = [replaceRouteId(routes.sourcesRemove.path, '1')];

    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'ADD_MESSAGE' }));
  });

  it('Renders null if user is admin', () => {
    initialStore = mockStore({ user: { writePermissions: true } });

    const wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoWriteAccess {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    expect(wrapper.html()).toEqual('');
  });

  it('Renders null if user has write permissions', () => {
    initialStore = mockStore({ user: { writePermissions: true } });

    const wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoWriteAccess {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    expect(wrapper.html()).toEqual('');
  });

  it('Renders null if app does not if user is admin (undefined)', () => {
    initialStore = mockStore({ user: { writePermissions: undefined } });

    const wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoWriteAccess {...args} />} />,
        initialStore,
        initialEntry
      )
    );

    expect(actions.addMessage).not.toHaveBeenCalled();
    expect(wasRedirectedToRoot(wrapper)).toEqual(false);
    expect(wrapper.html()).toEqual('');
  });

  it('Renders redirect and creates message if user is not admin', async () => {
    let wrapper;

    initialStore = mockStore({ user: { writePermissions: false } });

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <RedirectNoWriteAccess {...args} />} />,
          initialStore,
          initialEntry
        )
      );
    });

    expect(actions.addMessage).toHaveBeenCalled();
    expect(actions.addMessage).toHaveBeenCalledWith({
      title: expect.any(String),
      variant: 'danger',
      description: expect.any(String),
    });

    expect(wasRedirectedToRoot(wrapper)).toEqual(true);
  });
});
