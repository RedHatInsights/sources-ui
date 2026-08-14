import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import { getDevStore } from './utilities/getDevStore';

let store;
if (!store) {
  store = getDevStore();
}

const DevEntry = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default DevEntry;
