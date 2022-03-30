import React from 'react';
import 'whatwg-fetch'; // fetch for Nodejs
import '@testing-library/jest-dom/extend-expect';

global.React = React;

process.env.BASE_PATH = '/api';

global.insights = {
  chrome: {
    init: () => {},
    identifyApp: () => ({}),
    isBeta: () => true,
    on: () => () => undefined,
    auth: {
      getUser: () =>
        new Promise((resolve) =>
          resolve({
            identity: {
              user: {
                is_org_admin: true,
              },
            },
          })
        ),
    },
  },
};

global.innerWidth = 1080;

Element.prototype.scrollTo = () => {};
