import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ContentLoader from 'react-content-loader';

const SourcesPage = lazy(() => import(/* webpackChunkName: "sourcePage" */ './pages/Sources'));

const Loader = () => (
    <ContentLoader>
        <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
        <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
        <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
    </ContentLoader>
);

export const routes = {
    sources: {
        path: '/sources'
    },
    sourcesNew: {
        path: '/sources/new',
        writeAccess: true
    },
    sourcesEdit: {
        path: '/sources/edit/:id',
        writeAccess: true
    },
    sourcesRemove: {
        path: '/sources/remove/:id',
        redirectNoId: true,
        writeAccess: true
    },
    sourceManageApps: {
        path: '/sources/manage_apps/:id',
        redirectNoId: true,
        writeAccess: true
    }
};

export const replaceRouteId = (path, id) => path.replace(':id', id);

const Routes = () =>  (
    <Suspense fallback={<Loader/>}>
        <Route component={SourcesPage} />
    </Suspense>
);

export default Routes;
