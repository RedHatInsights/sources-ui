import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';

import Routes from './Routes';
import './App.scss';

import ErrorBoundary from './components/ErrorBoundary';
import PermissionsChecker from './components/PermissionsChecker';
import DataLoader from './components/DataLoader';
import { CLOUD_CARDS_KEY } from './components/CloudTiles/CloudCards';

import { getBaseName } from './frontend-components-copies/getBaseName';

const App = ({ store }) => {
  useEffect(() => {
    insights.chrome.init();
    try {
      insights.chrome.identifyApp('sources');
    } catch (_exception) {
      // eslint-disable-next-line no-console
      console.warn('Failed to initialize chrome navigation.');
    }

    return () => {
      sessionStorage.removeItem(CLOUD_CARDS_KEY);
    };
  }, []);

  return (
    <Provider store={store}>
      <Router basename={getBaseName(location.pathname, 1)}>
        <IntlProvider locale="en">
          <React.Fragment>
            <NotificationsPortal />
            <ErrorBoundary>
              <PermissionsChecker>
                <Main style={{ padding: 0 }}>
                  <DataLoader />
                  <Routes />
                </Main>
              </PermissionsChecker>
            </ErrorBoundary>
          </React.Fragment>
        </IntlProvider>
      </Router>
    </Provider>
  );
};

App.propTypes = {
  store: PropTypes.object,
};

export default App;
