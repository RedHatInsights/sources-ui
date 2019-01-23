import { Route, Switch, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import React from 'react';
import asyncComponent from './Utilities/asyncComponent';
import some from 'lodash/some';
import reduce from 'lodash/reduce';

import { viewDefinitions } from './views/viewDefinitions';

/**
 * Aysnc imports of components
 *
 * https://webpack.js.org/guides/code-splitting/
 * https://reactjs.org/docs/code-splitting.html
 *
 * pros:
 *      1) code splitting
 *      2) can be used in server-side rendering
 * cons:
 *      1) nameing chunk names adds unnecessary docs to code,
 *         see the difference with DashboardMap and InventoryDeployments.
 *
 */
const ProviderPage = asyncComponent(() => import(
    /* webpackChunkName: "ProviderPage" */ './SmartComponents/ProviderPage/ProviderPage'));
const ListingPage = asyncComponent(() => import(
    /* webpackChunkName: "ListingPage" */ './SmartComponents/ListingPage/ListingPage'));
const DetailPage = asyncComponent(() => import(
    /* webpackChunkName: "DetailPage" */ './SmartComponents/DetailPage/DetailPage'));
const TopologyPage = asyncComponent(() => import(
    /* webpackChunkName: "TopologyPage" */ './SmartComponents/TopologyPage/TopologyPage'));

const paths = {
    providers: '/sources',
    provider_new: '/sources/new',
    vms: '/source/:id/vms',
    provider_detail: '/source/:id',
    topology: '/source/:id/topology'
};

const InsightsRoute = ({ component: Component, rootClass, ...rest }) => {
    const root = document.getElementById('root');
    root.removeAttribute('class');
    root.classList.add(`page__${rootClass}`);

    return (<Component {...rest} />);
};

InsightsRoute.propTypes = {
    component: PropTypes.func,
    rootClass: PropTypes.string
};

const dynamicRoutes = (viewDefinitions) =>
    reduce(Object.keys(viewDefinitions), (acc, viewName) => (
        acc.push(
            <InsightsRoute path={`/source/:id/${viewName}`} key={viewName} component={ListingPage} rootClass='listing' />
        ) && acc
    ), []);

/**
 * the Switch component changes routes depending on the path.
 *
 * Route properties:
 *      exact - path must match exactly,
 *      path - https://prod.foo.redhat.com:1337/insights/advisor/rules
 *      component - component to be rendered when a route has been chosen.
 */
export const Routes = (props) => {
    const path = props.childProps.location.pathname;

    return (
        <Switch>
            {/**<InsightsRoute exact path={paths.providers} component={ProviderPage} rootClass='providers' /> **/}
            <InsightsRoute path={paths.providers} component={ProviderPage} rootClass='providers' />
            <InsightsRoute path={paths.vms} component={ListingPage} rootClass='listing' />
            <InsightsRoute exact path={paths.provider_detail} component={DetailPage} rootClass='provider' />
            <InsightsRoute path={paths.topology} component={TopologyPage} rootClass='provider' />
            { dynamicRoutes(viewDefinitions) }

            {/* Finally, catch all unmatched routes */}
            <Route render={() => some(paths, p => p === path) ? null : (<Redirect to={paths.providers} />)} />
        </Switch>
    );
};

Routes.propTypes = {
    childProps: PropTypes.any.isRequired
};
