import React from 'react';
import { Provider } from 'react-redux';

import App from './App';

import { getProdStore } from './utilities/store';

let store;
if (!store) {
  store = getProdStore();
}

const AppEntry = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppEntry;
