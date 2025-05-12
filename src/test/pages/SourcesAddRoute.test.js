import { act, render, screen } from '@testing-library/react';

import SourcesPage from '../../pages/Sources';

import { sourcesDataGraphQl } from '../__mocks__/sourcesData';
import sourceTypes from '../__mocks__/sourceTypes';
import applicationTypes from '../__mocks__/applicationTypes';

import { componentWrapperIntl } from '../../utilities/testsHelpers';

import * as api from '../../api/entities';
import * as typesApi from '../../api/source_types';

import { routes } from '../../routes';
import * as wizard from '../../components/addSourceWizard';
import { getStore } from '../../utilities/store';
import ElementWrapper from '../../components/ElementWrapper/ElementWrapper';
import { Route, Routes } from 'react-router-dom';

describe('SourcesPage - addSource route', () => {
  let store;

  const wasRedirectedToRoot = () =>
    screen.getByTestId('location-display').textContent === '/settings/integrations' + routes.sources.path;

  beforeEach(() => {
    wizard.AddSourceWizard = () => <h2>AddSource mock</h2>;

    api.doLoadEntities = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: sourcesDataGraphQl,
        meta: { count: sourcesDataGraphQl.length },
      }),
    );
    api.doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve(applicationTypes));
    typesApi.doLoadSourceTypes = jest.fn().mockImplementation(() => Promise.resolve(sourceTypes));

    store = getStore([], {
      user: { writePermissions: false },
    });
  });

  it('redirect when not org admin', async () => {
    const initialEntry = [routes.sourcesNew.path];

    await act(async () => {
      render(
        componentWrapperIntl(
          <Routes>
            <Route path="/" element={<SourcesPage />}>
              <Route
                path={routes.sourcesNew.path}
                element={
                  <ElementWrapper route={routes.sourcesNew}>
                    <wizard.AddSourceWizard />
                  </ElementWrapper>
                }
              />
            </Route>
          </Routes>,
          store,
          initialEntry,
        ),
      );
    });

    expect(() => screen.getByText('AddSource mock')).toThrow();
    expect(wasRedirectedToRoot()).toEqual(true);
  });
});
