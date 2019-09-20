import React, { Component, Fragment } from 'react';
import ReducerRegistry, { applyReducerHash } from '@redhat-cloud-services/frontend-components-utilities/files/ReducerRegistry';
import {
    NotificationsPortal,
    notifications,
    notificationsMiddleware
} from '@redhat-cloud-services/frontend-components-notifications';
import { Main } from '@redhat-cloud-services/frontend-components';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { IntlProvider } from 'react-intl';
import promise from 'redux-promise-middleware';

import ReducersProviders, { defaultProvidersState } from './redux/reducers/providers';

import Routes from './Routes';
import './App.scss';

let registry;

class App extends Component {
    static getRegistry () {
        if (!registry) {
            registry = new ReducerRegistry(
                {},
                [
                    thunk,
                    notificationsMiddleware({ errorTitleKey: 'error.title', errorDescriptionKey: 'error.detail' }),
                    logger,
                    promise
                ]
            );
        }

        return registry;
    }

    componentDidMount () {
        App.getRegistry().register({ providers: applyReducerHash(ReducersProviders, defaultProvidersState) });
        App.getRegistry().register({ notifications });

        insights.chrome.init();
        try {
            insights.chrome.identifyApp('sources');
        } catch (_exception) {
            console.warn('Failed to initialize chrome navigation.');
        }
    }

    render () {
        return (
            <IntlProvider locale="en">
                <Fragment>
                    <NotificationsPortal />
                    <Main style={ { padding: 0 } } >
                        <Routes childProps={this.props} />
                    </Main>
                </Fragment>
            </IntlProvider>
        );
    }
}

export default App;
