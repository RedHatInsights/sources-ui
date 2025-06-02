import React, { useEffect } from 'react';
import NotificationsProvider from '@redhat-cloud-services/frontend-components-notifications/NotificationsProvider';
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
import { initAxios } from './api/entities';

const App = () => {
  const chrome = useChrome();

  chrome?.updateDocumentTitle?.('Integrations');

  useEffect(() => {
    initAxios(chrome.auth.getUser, chrome.auth.logout);
    return () => {
      sessionStorage.removeItem(CLOUD_CARDS_KEY);
    };
  }, []);

  return (
    <IntlProvider locale="en">
      <React.Fragment>
        <NotificationsProvider />
        <ErrorBoundary>
          <PermissionsChecker>
            <section className="pf-v6-u-p-0 src-c-section-main">
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
