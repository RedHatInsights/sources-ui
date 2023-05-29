import React, { Suspense, lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AppPlaceholder } from './components/SourcesTable/loaders';
import ElementWrapper from './components/ElementWrapper/ElementWrapper';

const SourcesPage = lazy(() => import(/* webpackChunkName: "sourcesPage" */ './pages/Sources'));
const SourceDetail = lazy(() => import(/* webpackChunkName: "sourceDetail" */ './pages/Detail'));
const AddSourceWizard = lazy(() => import(/* webpackChunkName: "addSourceWizard" */ './components/addSourceWizard'));
const SourceRemoveModal = lazy(() =>
  import(/* webpackChunkName: "removeSource" */ './components/SourceRemoveModal/SourceRemoveModal')
);

const AddApplication = lazy(() => import(/* webpackChunkName "addApp" */ './components/AddApplication/AddApplication'));
const RemoveAppModal = lazy(() => import(/* webpackChunkName "removeApp" */ './components/AddApplication/RemoveAppModal'));
const SourceRenameModal = lazy(() => import(/* webpackChunkName "renameSource" */ './components/SourceDetail/SourceRenameModal'));
const CredentialsForm = lazy(() =>
  import(/* webpackChunkName "credentialsForm" */ './components/CredentialsForm/CredentialsForm')
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

const Routing = () => (
  <Suspense fallback={<AppPlaceholder />}>
    <Routes>
      <Route path="/" element={<SourcesPage />}>
        <Route
          path={routes.sourcesRemove.path}
          element={
            <ElementWrapper route={routes.sourcesRemove}>
              <SourceRemoveModal backPath={routes.sources.path} />
            </ElementWrapper>
          }
        />
        <Route
          path={routes.sourcesNew.path}
          element={
            <ElementWrapper route={routes.sourcesNew}>
              <AddSourceWizard />
            </ElementWrapper>
          }
        />
      </Route>
      <Route path={routes.sourcesDetail.path} element={<SourceDetail />}>
        <Route
          path="remove"
          element={
            <ElementWrapper route={routes.sourcesDetail}>
              <SourceRemoveModal />
            </ElementWrapper>
          }
        />
        <Route
          path="add_app/:app_type_id"
          element={
            <ElementWrapper route={routes.sourcesDetailAddApp}>
              <AddApplication />
            </ElementWrapper>
          }
        />
        <Route
          path="remove_app/:app_id"
          element={
            <ElementWrapper route={routes.sourcesDetailRemoveApp}>
              <RemoveAppModal />
            </ElementWrapper>
          }
        />
        <Route
          path="rename"
          element={
            <ElementWrapper route={routes.sourcesDetail}>
              <SourceRenameModal />
            </ElementWrapper>
          }
        />
        <Route
          path="edit_credentials"
          element={
            <ElementWrapper route={routes.sourcesDetail}>
              <CredentialsForm />
            </ElementWrapper>
          }
        />
      </Route>
    </Routes>
  </Suspense>
);

export default Routing;
