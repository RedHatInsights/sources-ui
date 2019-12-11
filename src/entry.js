import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './App';
import { getBaseName } from '@redhat-cloud-services/frontend-components-utilities/files/helpers';
import { getProdStore } from './Utilities/store';

ReactDOM.render(
    <Provider store={getProdStore()}>
        <Router basename={getBaseName(location.pathname)}>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
