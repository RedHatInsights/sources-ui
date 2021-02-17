import React from 'react';
import ReactDOM from 'react-dom';
import DevEntry from './DevEntry';

const root = document.getElementById('root');

ReactDOM.render(<DevEntry />, root, () => root.setAttribute('data-ouia-safe', true));
