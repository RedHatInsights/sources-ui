import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
//import ReducerRegistry from './Utilities/ReducerRegistry';
import App from './App';

// exposes webpack variable RELEASE
/*global RELEASE:true*/
/*eslint no-undef: "error"*/

/**
 * Hooks up redux to app.
 *  https://redux.js.org/advanced/usage-with-react-router
 */
console.log(App);
ReactDOM.render(
    <Provider store={App.getRegistry().getStore()}>
        <Router basename={ `/${RELEASE}/platform/topological-inventory` }>
            <App />
        </Router>
    </Provider>,
    document.getElementById('root')
);
