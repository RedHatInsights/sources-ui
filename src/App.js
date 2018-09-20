import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import promiseMiddleware from 'redux-promise-middleware';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components'
import { Routes } from './Routes';
import './App.scss';

import Reducers, { defaultState } from './redux/reducers/entity_list';
import ReducersListing from './redux/reducers/listing';

import logger from 'redux-logger';

let registry;

class App extends Component {

    constructor (props) {
      super(props);
    }

    static getRegistry () {
      if (! registry) {
        registry = new ReducerRegistry({}, [logger, promiseMiddleware()]);
      }
      return registry;
    }

    componentDidMount () {
        console.log('getStore()');
        console.log(App.getRegistry().getStore());

        App.getRegistry().register({inventory: applyReducerHash({...Reducers, ...ReducersListing}, defaultState)});

        insights.chrome.init();
        insights.chrome.identifyApp('topologyui');

        this.appNav = insights.chrome.on('APP_NAVIGATION', event => this.props.history.push(`/${event.navId}`));
    }

    componentWillUnmount () {
        this.appNav();
        this.buildNav();
    }

    render () {
        return (
            <Routes childProps={this.props} />
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
