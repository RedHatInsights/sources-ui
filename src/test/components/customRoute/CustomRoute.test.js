import React from 'react';
import { Route } from 'react-router-dom';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import CustomRoute from '../../../components/CustomRoute/CustomRoute';
import RedirectNoWriteAccess from '../../../components/RedirectNoWriteAccess/RedirectNoWriteAccess';
import * as RedirectNoId from '../../../components/RedirectNoId/RedirectNoId';
import * as useSource from '../../../hooks/useSource';
import mockStore from '../../__mocks__/mockStore';

describe('CustomRoute', () => {
  const PokusComponent = (props) => <h1 {...props}>Custom component</h1>;

  let route;
  let store;

  beforeEach(() => {
    route = {
      path: '/path',
    };
  });

  it('renders route component', () => {
    const wrapper = mount(componentWrapperIntl(<CustomRoute exact route={route} Component={PokusComponent} />));

    expect(wrapper.find(Route)).toHaveLength(1);
    expect(wrapper.find(Route).props().exact).toEqual(true);
    expect(wrapper.find(Route).props().path).toEqual(route.path);
    expect(wrapper.find(Route).props().component).toEqual(undefined);
    expect(wrapper.find(PokusComponent)).toHaveLength(0);
    expect(wrapper.find(RedirectNoWriteAccess)).toHaveLength(0);
    expect(wrapper.find(RedirectNoId)).toHaveLength(0);
  });

  it('renders custom component', () => {
    const wrapper = mount(
      componentWrapperIntl(<CustomRoute exact route={route} Component={PokusComponent} />, undefined, ['/path'])
    );

    expect(wrapper.find(PokusComponent)).toHaveLength(1);
  });

  it('renders custom component and passes props', () => {
    const wrapper = mount(
      componentWrapperIntl(
        <CustomRoute
          exact
          route={route}
          Component={PokusComponent}
          componentProps={{ className: 'pepa', style: { color: 'red' } }}
        />,
        undefined,
        ['/path']
      )
    );

    expect(wrapper.find(PokusComponent)).toHaveLength(1);
    expect(wrapper.find(PokusComponent).props().className).toEqual('pepa');
    expect(wrapper.find(PokusComponent).props().style).toEqual({
      color: 'red',
    });
  });

  it('renders RedirectNotAdmin when writeAccess set', () => {
    store = mockStore({ user: { isOrgAdmin: true } });

    route = {
      ...route,
      writeAccess: true,
    };

    const wrapper = mount(componentWrapperIntl(<CustomRoute exact route={route} Component={PokusComponent} />, store, ['/path']));

    expect(wrapper.find(PokusComponent)).toHaveLength(1);
    expect(wrapper.find(RedirectNoWriteAccess)).toHaveLength(1);
  });

  it('renders RedirectNoId when redirectNoId set', () => {
    useSource.useSource = jest.fn().mockImplementation(() => undefined);
    RedirectNoId.default = () => <h1>Redirect no ID mock</h1>;

    route = {
      ...route,
      redirectNoId: true,
    };

    const wrapper = mount(
      componentWrapperIntl(<CustomRoute exact route={route} Component={PokusComponent} />, undefined, ['/path/'])
    );

    expect(wrapper.find(RedirectNoId.default)).toHaveLength(1);
    expect(useSource.useSource).toHaveBeenCalled();
  });
});
