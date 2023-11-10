import React, { Suspense, lazy, useMemo } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppPlaceholder } from './components/SourcesTable/loaders';
import ElementWrapper from './components/ElementWrapper/ElementWrapper';

const SourcesPage = lazy(() => import(/* webpackChunkName: "sourcesPage" */ './pages/Sources'));
const SourceDetail = lazy(() => import(/* webpackChunkName: "sourceDetail" */ './pages/Detail'));
const AddSourceWizard = lazy(() => import(/* webpackChunkName: "addSourceWizard" */ './components/addSourceWizard'));
const SourceRemoveModal = lazy(() =>
  import(/* webpackChunkName: "removeSource" */ './components/SourceRemoveModal/SourceRemoveModal'),
);

const AddApplication = lazy(() => import(/* webpackChunkName "addApp" */ './components/AddApplication/AddApplication'));
const RemoveAppModal = lazy(() => import(/* webpackChunkName "removeApp" */ './components/AddApplication/RemoveAppModal'));
const SourceRenameModal = lazy(() => import(/* webpackChunkName "renameSource" */ './components/SourceDetail/SourceRenameModal'));
const CredentialsForm = lazy(() =>
  import(/* webpackChunkName "credentialsForm" */ './components/CredentialsForm/CredentialsForm'),
);

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

const routeMap = [
  {
    route: {
      path: '/',
    },
    element: SourcesPage,
    childRoutes: [
      {
        route: routes.sourcesRemove,
        element: SourceRemoveModal,
        elementProps: {
          backPath: routes.sources.path,
        },
      },
      {
        route: routes.sourcesNew,
        element: AddSourceWizard,
      },
    ],
  },
  {
    route: routes.sourcesDetail,
    element: SourceDetail,
    childRoutes: [
      {
        route: routes.sourcesDetail,
        path: 'remove',
        element: SourceRemoveModal,
      },
      {
        route: routes.sourcesDetailAddApp,
        path: 'add_app/:app_type_id',
        element: AddApplication,
      },
      {
        route: routes.sourcesDetailRemoveApp,
        path: 'remove_app/:app_id',
        element: RemoveAppModal,
      },
      {
        route: routes.sourcesDetail,
        path: 'rename',
        element: SourceRenameModal,
      },
      {
        route: routes.sourcesDetail,
        path: 'edit_credentials',
        element: CredentialsForm,
      },
    ],
  },
];

const renderRoutes = (routes = []) =>
  routes.map(({ route, path, element: Element, childRoutes, elementProps }) => (
    <Route
      key={path || route.path}
      path={path || route.path}
      element={
        <ElementWrapper route={route}>
          <Element {...elementProps} />
        </ElementWrapper>
      }
    >
      {renderRoutes(childRoutes)}
    </Route>
  ));

const Routing = () => {
  const routes = useMemo(() => renderRoutes(routeMap), [routeMap]);
  return (
    <Suspense fallback={<AppPlaceholder />}>
      <Routes>{routes}</Routes>
    </Suspense>
  );
};

export default Routing;
