import React from 'react';
import PropTypes from 'prop-types';

import App from './App';

import { getProdStore } from './utilities/store';

const AppEntry = ({ store }) => <App store={store ? store : getProdStore()} />;

AppEntry.propTypes = {
  store: PropTypes.object,
};

export default AppEntry;
