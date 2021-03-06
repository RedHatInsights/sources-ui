import React, { useEffect } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router } from 'react-router-dom';

import Routes from './Routes';

import './App.scss';
import './styles/authSelect.scss';
import './styles/cardSelect.scss';
import './styles/costManagement.scss';

import ErrorBoundary from './components/ErrorBoundary';
import PermissionsChecker from './components/PermissionsChecker';
import DataLoader from './components/DataLoader';
import { CLOUD_CARDS_KEY } from './components/CloudTiles/CloudCards';
import NavigationListener from './components/NavigationListener';

import { getBaseName } from './frontend-components-copies/getBaseName';

const App = () => {
  useEffect(() => {
    return () => {
      sessionStorage.removeItem(CLOUD_CARDS_KEY);
    };
  }, []);

  return (
    <Router basename={getBaseName(location.pathname, 1)}>
      <IntlProvider locale="en">
        <React.Fragment>
          <NotificationsPortal />
          <ErrorBoundary>
            <PermissionsChecker>
              <Main style={{ padding: 0 }}>
                <DataLoader />
                <NavigationListener />
                <Routes />
              </Main>
            </PermissionsChecker>
          </ErrorBoundary>
        </React.Fragment>
      </IntlProvider>
    </Router>
  );
};

export default App;
