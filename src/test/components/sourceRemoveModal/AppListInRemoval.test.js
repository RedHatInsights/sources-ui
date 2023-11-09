import { Route, Routes } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import AppListInRemoval from '../../../components/SourceRemoveModal/AppListInRemoval';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { replaceRouteId, routes } from '../../../Routing';
import appTypes, { CATALOG_APP, COST_MANAGEMENT_APP } from '../../__mocks__/applicationTypes';

import mockStore from '../../__mocks__/mockStore';

describe('AppListInRemoval', () => {
  let initialProps;

  let store;

  beforeEach(() => {
    store = mockStore({
      sources: { appTypes },
    });
  });

  it('renders with unknow app type', () => {
    initialProps = {
      applications: [{ application_type_id: undefined, id: 1 }],
    };

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<AppListInRemoval {...initialProps} />} />
        </Routes>,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')],
      ),
    );

    expect(screen.getByText('Unknown')).toBeInTheDocument();
  });

  it('renders with 1 app', () => {
    initialProps = {
      applications: [{ application_type_id: CATALOG_APP.id, id: 1 }],
    };

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<AppListInRemoval {...initialProps} />} />
        </Routes>,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')],
      ),
    );

    expect(screen.getByText(CATALOG_APP.display_name, { selector: 'p' })).toBeInTheDocument();
  });

  it('renders with more apps', () => {
    initialProps = {
      applications: [
        { application_type_id: CATALOG_APP.id, id: 1 },
        { application_type_id: COST_MANAGEMENT_APP.id, id: 2 },
      ],
    };

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesRemove.path} element={<AppListInRemoval {...initialProps} />} />
        </Routes>,
        store,
        [replaceRouteId(routes.sourcesRemove.path, '406')],
      ),
    );

    expect(screen.getByText(CATALOG_APP.display_name, { selector: 'li' })).toBeInTheDocument();
    expect(screen.getByText(COST_MANAGEMENT_APP.display_name, { selector: 'li' })).toBeInTheDocument();
  });
});
