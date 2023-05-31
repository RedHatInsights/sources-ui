/* eslint-disable no-undef */
import React from 'react';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/extend-expect';
import { initAxios } from '../src/api/entities';

global.React = React;

process.env.BASE_PATH = '/api';

global.innerWidth = 1080;

Element.prototype.scrollTo = () => {};

// ensure the axios is initialized in test env with correct interceptors
initAxios(
  () =>
    new Promise((resolve) =>
      resolve({
        identity: {
          user: {
            is_org_admin: true,
          },
        },
      })
    ),
  () => undefined
);

global.mockApi = () => {
  const mockFn = jest.fn().mockImplementation(
    () =>
      new Promise((res, rej) => {
        mockFn.resolve = res;
        mockFn.reject = rej;
      })
  );

  return mockFn;
};
