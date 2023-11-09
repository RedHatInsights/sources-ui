/* eslint-disable no-undef */
import React from 'react';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/jest-globals';

global.React = React;

process.env.BASE_PATH = '/api';

global.innerWidth = 1080;

Element.prototype.scrollTo = () => {};

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
