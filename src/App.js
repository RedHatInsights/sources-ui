import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import {
    NotificationsPortal,
    notifications,
    notificationsMiddleware
} from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { Routes } from './Routes';
import './App.scss';

import ReducersProviders, { defaultProvidersState } from './redux/reducers/providers';
import ReducersListing, { defaultListingState } from './redux/reducers/listing';
import ReducersTopology from './redux/reducers/topology';

import logger from 'redux-logger';

let registry;

class App extends Component {

    constructor (props) {
        super(props);
    }

    static getRegistry () {
        if (!registry) {
            registry = new ReducerRegistry(
                {},
                [
                    promiseMiddleware(),
                    notificationsMiddleware({ errorTitleKey: 'error', errorDescriptionKey: 'error' }),
                    logger
                ]
            );
        }

        return registry;
    }

    componentDidMount () {
        console.log('getStore()');
        console.log(App.getRegistry().getStore());

        App.getRegistry().register({ providers: applyReducerHash(ReducersProviders, defaultProvidersState) });
        App.getRegistry().register({ listing: applyReducerHash(ReducersListing, defaultListingState) });
        App.getRegistry().register({ topology: applyReducerHash(ReducersTopology, {}) });
        App.getRegistry().register({ notifications });

        insights.chrome.init();
        insights.chrome.identifyApp('sources');

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => this.props.history.push(`/${event.navId}`));
    }

    componentWillUnmount () {
        this.appNav();
    }

    render () {
        return (
            <React.Fragment>
                <NotificationsPortal />
                <Routes childProps={this.props} />
            </React.Fragment>
        );
    }
}

App.propTypes = {
    history: PropTypes.object
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter (connect()(App));
