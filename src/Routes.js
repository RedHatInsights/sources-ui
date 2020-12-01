import React, { Suspense, lazy } from 'react';
import { Route, Switch } from 'react-router-dom';
import { AppPlaceholder } from './components/SourcesTable/loaders';

const SourcesPage = lazy(() => import(/* webpackChunkName: "sourcesPage" */ './pages/Sources'));
const SourceDetail = lazy(() => import(/* webpackChunkName: "sourceDetail" */ './pages/Detail'));

export const routes = {
  sources: {
    path: '/sources',
  },
  sourcesNew: {
    path: '/sources/new',
    writeAccess: true,
  },
  sourcesRemove: {
    path: '/sources/remove/:id',
    redirectNoId: true,
    writeAccess: true,
  },
  sourcesDetail: {
    path: '/sources/detail/:id',
    redirectNoId: true,
  },
  sourcesDetailRename: {
    path: '/sources/detail/:id/rename',
    redirectNoId: true,
    writeAccess: true,
  },
  sourcesDetailRemove: {
    path: '/sources/detail/:id/remove',
    redirectNoId: true,
    writeAccess: true,
  },
  sourcesDetailAddApp: {
    path: '/sources/detail/:id/add_app/:app_type_id',
    redirectNoId: true,
    writeAccess: true,
  },
  sourcesDetailRemoveApp: {
    path: '/sources/detail/:id/remove_app/:app_id',
    redirectNoId: true,
    writeAccess: true,
  },
};

export const replaceRouteId = (path, id) => path.replace(':id', id);

const Routes = () => (
  <Suspense fallback={<AppPlaceholder />}>
    <Switch>
      <Route path={routes.sourcesDetail.path} component={SourceDetail} />
      <Route component={SourcesPage} />
    </Switch>
  </Suspense>
);

export default Routes;
