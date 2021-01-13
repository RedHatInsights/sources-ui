import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'babel-polyfill';

import 'whatwg-fetch'; // fetch for Nodejs

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;

process.env.BASE_PATH = '/api';

global.insights = {
  chrome: {
    identifyApp: () => ({}),
    isBeta: () => true,
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

Element.prototype.scrollTo = () => {};
