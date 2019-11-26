import React, { Suspense, lazy } from 'react';
import { Route } from 'react-router-dom';
import ContentLoader from 'react-content-loader';
import ErrorBoundary from './components/ErrorBoundary';

const SourcesPage = lazy(() => import('./pages/SourcesPage'));

const Loader = () => (
    <ContentLoader>
        <rect x="0" y="0" rx="5" ry="5" width="70" height="70" />
        <rect x="80" y="17" rx="4" ry="4" width="300" height="13" />
        <rect x="80" y="40" rx="3" ry="3" width="250" height="10" />
    </ContentLoader>
);

export const paths = {
    sources: '/',
    sourcesNew: '/new',
    sourcesEdit: '/edit/:id',
    sourcesRemove: '/remove/:id',
    sourceManageApps: '/manage_apps/:id'
};

const Routes = () =>  (
    <div className='pf-c-page__main pf-l-page__main'>
        <ErrorBoundary>
            <Suspense fallback={<Loader/>}>
                <Route path={paths.sources} component={SourcesPage} />
            </Suspense>
        </ErrorBoundary>
    </div>
);

export default Routes;
