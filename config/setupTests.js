/* eslint-disable no-undef */
import React from 'react';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/jest-globals';

const crypto = require('crypto');

global.React = React;

process.env.BASE_PATH = '/api';

global.innerWidth = 1080;

Element.prototype.scrollTo = () => {};

// Crypto object polyfill for JSDOM
global.window.crypto = {
  ...crypto,
};
// in case the crypto package is mangled or the method does not exist
if (!global.window.crypto.randomUUID) {
  global.window.crypto.randomUUID = () => Date.now().toString(36) + Math.random().toString(36).slice(2);
}

global.mockApi = () => {
  const mockFn = jest.fn().mockImplementation(
    () =>
      new Promise((res, rej) => {
        mockFn.resolve = res;
        mockFn.reject = rej;
      }),
  );

  return mockFn;
};
