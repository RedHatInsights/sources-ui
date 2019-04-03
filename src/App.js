import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import {
    NotificationsPortal,
    notifications,
    notificationsMiddleware
} from '@red-hat-insights/insights-frontend-components/components/Notifications';

import logger from 'redux-logger';
import thunk from 'redux-thunk';

import ReducersProviders, { defaultProvidersState } from './redux/reducers/providers';
import ReducersListing, { defaultListingState } from './redux/reducers/listing';
import ReducersTopology from './redux/reducers/topology';

import { Routes } from './Routes';
import './App.scss';

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
                    thunk,
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
        try {
            insights.chrome.identifyApp('sources');
        } catch (_exception) {
            this.appNav = null;
            console.warn('Failed to initialize chrome navigation.');
        }
    }

    componentWillUnmount () {
        if (this.appNav) {
            this.appNav();
        }
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
