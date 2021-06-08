import { configure, mount, render, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
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
    init: () => {},
    identifyApp: () => ({}),
    isBeta: () => true,
    on: () => undefined,
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
