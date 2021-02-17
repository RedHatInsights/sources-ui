import React from 'react';
import { Provider } from 'react-redux';

import App from './App';
import { getDevStore } from './utilities/getDevStore';

const DevEntry = () => (
  <Provider store={getDevStore()}>
    <App />
  </Provider>
);

export default DevEntry;
