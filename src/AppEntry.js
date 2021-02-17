import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import App from './App';

import { getProdStore } from './utilities/store';

const AppEntry = ({ store }) => (
  <Provider store={store ? store : getProdStore()}>
    <App />
  </Provider>
);

AppEntry.propTypes = {
  store: PropTypes.object,
};

export default AppEntry;
