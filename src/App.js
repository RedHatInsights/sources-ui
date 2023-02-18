import React, { useEffect } from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { IntlProvider } from 'react-intl';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import Routing from './Routing';

import './App.scss';
import './styles/authSelect.scss';
import './styles/cardSelect.scss';
import './styles/costManagement.scss';

import ErrorBoundary from './components/ErrorBoundary';
import PermissionsChecker from './components/PermissionsChecker';
import DataLoader from './components/DataLoader';
import { CLOUD_CARDS_KEY } from './components/CloudTiles/CloudCards';

const App = () => {
  useEffect(() => {
    return () => {
      sessionStorage.removeItem(CLOUD_CARDS_KEY);
    };
  }, []);

  return (
    <IntlProvider locale="en">
      <React.Fragment>
        <NotificationsPortal />
        <ErrorBoundary>
          <PermissionsChecker>
            <section className="pf-u-p-0">
              <DataLoader />
              <Routing />
            </section>
          </PermissionsChecker>
        </ErrorBoundary>
      </React.Fragment>
    </IntlProvider>
  );
};

export default App;
