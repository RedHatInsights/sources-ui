import React from 'react';
import { IntlMessagesProvider, useChromeLocale } from './i18n';
import { Provider } from 'react-redux';
import { AccessCheck } from '@project-kessel/react-kessel-access-check';

import App from './App';
import { KesselRbacAccessProvider } from './rbac/KesselRbacAccessProvider';

import { getProdStore } from './utilities/store';

let store;
if (!store) {
  store = getProdStore();
}

const AppEntry = () => {
  const locale = useChromeLocale();

  return (
    <Provider store={store}>
      <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
        <KesselRbacAccessProvider>
          <IntlMessagesProvider locale={locale}>
            <App />
          </IntlMessagesProvider>
        </KesselRbacAccessProvider>
      </AccessCheck.Provider>
    </Provider>
  );
};

export default AppEntry;
