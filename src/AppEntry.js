import React from 'react';
import { Provider } from 'react-redux';

import App from './App';

import { getProdStore } from './utilities/store';

let store;
if (!store) {
  store = getProdStore();
}

const link = document.createElement('link')
link.href = "https://unpkg.com/@patternfly/patternfly@latest/patternfly.css"
link.rel = 'stylesheet'
link.type = 'text/css'

document.head.appendChild(link)

window.sc = __webpack_share_scopes__

const AppEntry = () => {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
};

export default AppEntry;
