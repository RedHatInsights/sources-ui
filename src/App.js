import React, { Component, Fragment } from 'react';
import { ReducerRegistry, applyReducerHash } from '@red-hat-insights/insights-frontend-components';
import {
    NotificationsPortal,
    notifications,
    notificationsMiddleware
} from '@red-hat-insights/insights-frontend-components/components/Notifications';
import { Main } from '@redhat-cloud-services/frontend-components';
import logger from 'redux-logger';
import thunk from 'redux-thunk';
import { IntlProvider } from 'react-intl';

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
                    logger
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
            const pathName = window.location.pathname.split('/');
            const appName = pathName[0] === 'beta' ? pathName[3] : pathName[2];
            insights.chrome.identifyApp(appName);
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
