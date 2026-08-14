import React from 'react';

import { render, screen } from '@testing-library/react';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import * as RedirectNoId from '../../../components/RedirectNoId/RedirectNoId';
import * as RedirectNoPaused from '../../../components/RedirectNoPaused/RedirectNoPaused';
import * as useSource from '../../../hooks/useSource';
import mockStore from '../../__mocks__/mockStore';
import ElementWrapper from '../../../components/ElementWrapper/ElementWrapper';
import { Outlet, Route, Routes } from 'react-router-dom';

describe('ElementWrapper', () => {
  const PokusComponent = (props) => <h1 {...props}>Custom component</h1>;

  let route;
  let store;

  beforeEach(() => {
    route = {
      path: '/path',
    };
  });

  it('renders custom component', () => {
    render(
      componentWrapperIntl(
        <ElementWrapper route={route}>
          <PokusComponent />
        </ElementWrapper>,
      ),
    );

    expect(screen.getByText('Custom component', { selector: 'h1' })).toBeInTheDocument();
  });

  it('renders custom component and passes props', () => {
    render(
      componentWrapperIntl(
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Outlet context={{ className: 'pepa', style: { color: 'red' } }} />
              </>
            }
          >
            <Route
              path="path"
              element={
                <ElementWrapper route={route}>
                  <PokusComponent />
                </ElementWrapper>
              }
            />
          </Route>
        </Routes>,
        undefined,
        ['/path'],
      ),
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

    render(
      componentWrapperIntl(
        <Routes>
          <Route
            path="/path"
            element={
              <ElementWrapper route={route}>
                <PokusComponent />
              </ElementWrapper>
            }
          />
        </Routes>,
        store,
        ['/path'],
      ),
    );

    expect(screen.getByTestId('location-display').textContent).toEqual('/settings/integrations/');
  });

  it('renders RedirectNoId when redirectNoId set', () => {
    useSource.useSource = jest.fn().mockImplementation(() => undefined);
    RedirectNoId.default = () => <h1>Redirect no ID mock</h1>;

    route = {
      ...route,
      redirectNoId: true,
    };

    render(
      componentWrapperIntl(
        <Routes>
          <Route
            path="/path/"
            element={
              <ElementWrapper route={route}>
                <PokusComponent />
              </ElementWrapper>
            }
          />
        </Routes>,
        undefined,
        ['/path/'],
      ),
    );

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

    render(
      componentWrapperIntl(
        <Routes>
          <Route
            path="/path"
            element={
              <ElementWrapper route={route}>
                <PokusComponent />
              </ElementWrapper>
            }
          />
        </Routes>,
        store,
        ['/path'],
      ),
    );

    expect(screen.getByText('Custom component', { selector: 'h1' })).toBeInTheDocument();
    expect(screen.getByText('Redirect no paused mock')).toBeInTheDocument();
  });
});
