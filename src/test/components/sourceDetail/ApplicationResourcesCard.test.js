import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';

import ApplicationResourcesCard from '../../../components/SourceDetail/ApplicationResourcesCard';
import * as SourceEditModal from '../../../components/SourceEditForm/SourceEditModal';
import { replaceRouteId, routes } from '../../../Routing';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';

describe('ApplicationResourcesCard', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, applications: [] }],
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<ApplicationResourcesCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByText('Manage connected applications')).toBeInTheDocument();
    expect(screen.getByText('Missing permissions')).toBeInTheDocument();
    expect(() => screen.getByText('No connected applications')).toThrow();
  });

  it('renders with no applications', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, applications: [] }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<ApplicationResourcesCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByText('Manage connected applications')).toBeInTheDocument();
    expect(screen.getByText('No connected applications')).toBeInTheDocument();
    expect(() => screen.getByText('Missing permissions')).toThrow();
  });

  it('renders with applications', async () => {
    SourceEditModal.default = () => <span>Mock component</span>;

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, applications: [{ id: 123 }] }],
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<ApplicationResourcesCard />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByText('Manage connected applications')).toBeInTheDocument();
    expect(screen.getByText('Mock component')).toBeInTheDocument();
    expect(() => screen.getByText('Missing permissions')).toThrow();
    expect(() => screen.getByText('No connected applications')).toThrow();
  });
});
