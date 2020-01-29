import React from 'react';
import { Provider } from 'react-redux';
import App from './App';
import { getDevStore, getProdStore } from './Utilities/store';

export const DevEntry = () => (<Provider store={getDevStore()}>
    <App />
</Provider>);

export const ProdEntry = () => (<Provider store={getProdStore()}>
    <App />
</Provider>);
