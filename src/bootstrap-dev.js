import React from 'react';
import ReactDOM from 'react-dom';
import AppEntry from './AppEntry';
import { getDevStore } from './utilities/getDevStore';

const root = document.getElementById('root');

ReactDOM.render(<AppEntry store={getDevStore()} />, root, () => root.setAttribute('data-ouia-safe', true));
