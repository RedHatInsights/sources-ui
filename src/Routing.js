import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppPlaceholder } from './components/SourcesTable/loaders';

const SourcesPage = lazy(() => import(/* webpackChunkName: "sourcesPage" */ './pages/Sources'));
const SourceDetail = lazy(() => import(/* webpackChunkName: "sourceDetail" */ './pages/Detail'));

export const routes = {
  sources: {
    path: '/',
  },
  sourcesNew: {
    path: 'new',
    writeAccess: true,
  },
  sourcesRemove: {
    path: 'remove/:id',
    redirectNoId: true,
    writeAccess: true,
  },
  sourcesDetail: {
    path: 'detail/:id',
    redirectNoId: true,
  },
  sourcesDetailRename: {
    path: 'detail/:id/rename',
    redirectNoId: true,
    writeAccess: true,
    noPaused: true,
  },
  sourcesDetailRemove: {
    path: 'detail/:id/remove',
    redirectNoId: true,
    writeAccess: true,
  },
  sourcesDetailAddApp: {
    path: 'detail/:id/add_app/:app_type_id',
    redirectNoId: true,
    writeAccess: true,
    noPaused: true,
  },
  sourcesDetailRemoveApp: {
    path: 'detail/:id/remove_app/:app_id',
    redirectNoId: true,
    writeAccess: true,
    noPaused: true,
  },
  sourcesDetailEditCredentials: {
    path: 'detail/:id/edit_credentials',
    redirectNoId: true,
    writeAccess: true,
  },
};

export const replaceRouteId = (path, id) => path.replace(':id', id);

const Routing = () => (
  <Suspense fallback={<AppPlaceholder />}>
    <Routes>
      <Route path={`${routes.sourcesDetail.path}/*`} element={<SourceDetail />} />
      <Route path="/*" element={<SourcesPage />} />
    </Routes>
  </Suspense>
);

export default Routing;
