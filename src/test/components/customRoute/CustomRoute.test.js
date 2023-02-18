import React from 'react';

import { render, screen } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import CustomRoute from '../../../components/CustomRoute/CustomRoute';
import * as RedirectNoId from '../../../components/RedirectNoId/RedirectNoId';
import * as RedirectNoPaused from '../../../components/RedirectNoPaused/RedirectNoPaused';
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

  it('renders custom component', () => {
    render(componentWrapperIntl(<CustomRoute exact route={route} Component={PokusComponent} />, undefined, ['/path']));

    expect(screen.getByText('Custom component', { selector: 'h1' })).toBeInTheDocument();
  });

  it('renders custom component and passes props', () => {
    render(
      componentWrapperIntl(
        <CustomRoute route={route} Component={PokusComponent} componentProps={{ className: 'pepa', style: { color: 'red' } }} />,
        undefined,
        ['/path']
      )
    );

    expect(screen.getByText('Custom component', { selector: 'h1' })).toHaveClass('pepa');
    expect(screen.getByText('Custom component', { selector: 'h1' })).toHaveStyle({ color: 'red' });
  });

  it('renders RedirectNotAdmin when writeAccess set', () => {
    store = mockStore({ user: { writePermissions: false } });

    route = {
      ...route,
      writeAccess: true,
    };

    render(componentWrapperIntl(<CustomRoute route={route} Component={PokusComponent} />, store, ['/path']));

    expect(screen.getByTestId('location-display').textContent).toEqual('/settings/sources/');
  });

  it('renders RedirectNoId when redirectNoId set', () => {
    useSource.useSource = jest.fn().mockImplementation(() => undefined);
    RedirectNoId.default = () => <h1>Redirect no ID mock</h1>;

    route = {
      ...route,
      redirectNoId: true,
    };

    render(componentWrapperIntl(<CustomRoute route={route} Component={PokusComponent} />, undefined, ['/path/']));

    expect(screen.getByText('Redirect no ID mock')).toBeInTheDocument();
    expect(useSource.useSource).toHaveBeenCalled();
  });

  it('renders RedirectNoPaused when no paused set', () => {
    useSource.useSource = jest.fn().mockImplementation(() => ({ paused_at: 'today' }));
    RedirectNoPaused.default = () => <h1>Redirect no paused mock</h1>;

    route = {
      ...route,
      noPaused: true,
    };

    render(componentWrapperIntl(<CustomRoute route={route} Component={PokusComponent} />, store, ['/path']));

    expect(screen.getByText('Custom component', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByText('Redirect no paused mock')).toBeInTheDocument();
  });
});
