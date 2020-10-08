import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import { AppPlaceholder } from './components/SourcesTable/loaders';

const SourcesPage = lazy(() => import(/* webpackChunkName: "sourcePage" */ './pages/Sources'));

export const routes = {
  sources: {
    path: '/sources',
  },
  sourcesNew: {
    path: '/sources/new',
    writeAccess: true,
  },
  sourcesEdit: {
    path: '/sources/edit/:id',
    writeAccess: true,
    redirectNoId: true,
  },
  sourcesRemove: {
    path: '/sources/remove/:id',
    redirectNoId: true,
    writeAccess: true,
  },
  sourceManageApps: {
    path: '/sources/manage_apps/:id',
    redirectNoId: true,
    writeAccess: true,
  },
};

export const replaceRouteId = (path, id) => path.replace(':id', id);

const Routes = () => (
  <Suspense fallback={<AppPlaceholder />}>
    <Route component={SourcesPage} />
  </Suspense>
);

export default Routes;
