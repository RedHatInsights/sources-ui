import React, { useEffect } from 'react';
import { NotificationsPortal } from '@redhat-cloud-services/frontend-components-notifications';
import { Main } from '@redhat-cloud-services/frontend-components';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';

import Routes from './Routes';
import './App.scss';

import ErrorBoundary from './components/ErrorBoundary';
import PermissionsChecker from './components/PermissionsChecker';

const App = (props) => {
    useEffect(() => {
        insights.chrome.init();
        try {
            insights.chrome.identifyApp('sources');
        } catch (_exception) {
            // eslint-disable-next-line no-console
            console.warn('Failed to initialize chrome navigation.');
        }
    }, []);

    return (
        <ErrorBoundary>
            <Router basename={getBaseName(location.pathname)}>
                <IntlProvider locale="en">
                    <React.Fragment>
                        <NotificationsPortal />
                        <PermissionsChecker>
                            <Main style={ { padding: 0 } } >
                                <Routes childProps={props} />
                            </Main>
                        </PermissionsChecker>
                    </React.Fragment>
                </IntlProvider>
            </Router>
        </ErrorBoundary>
    );
};

export default App;
