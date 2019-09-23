import React, { Suspense, lazy } from 'react';
import { Route, Switch, Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import some from 'lodash/some';
import ContentLoader from 'react-content-loader';

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

const Routes = (props) => {
    const path = props.location.pathname;

    return (
        <div className='pf-c-page__main pf-l-page__main'>
            <Suspense fallback={<Loader/>}>
                <Switch>
                    <Route exact path={paths.sources} component={SourcesPage} />
                    <Route exact path={paths.sourcesNew} component={SourcesPage} />
                    <Route path={paths.sourcesEdit} component={SourcesPage} />
                    <Route path={paths.sourcesRemove} component={SourcesPage} />
                    <Route path={paths.sourceManageApps} component={SourcesPage} />
                    <Route render={() => some(paths, p => p === path) ? null : (<Redirect to={paths.providers} />)} />
                </Switch>
            </Suspense>
        </div>
    );
};

Routes.propTypes = {
    childProps: PropTypes.any.isRequired,
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired
    }).isRequired
};

export default withRouter(Routes);
