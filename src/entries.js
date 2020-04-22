import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { getProdStore } from './utilities/store';

export const ProdEntry = () => (<Provider store={getProdStore()}>
    <App />
</Provider>);
