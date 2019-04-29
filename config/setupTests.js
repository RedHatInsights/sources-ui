import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'babel-polyfill';
import toJson from 'enzyme-to-json';
import fetchMock from 'fetch-mock';
import mock, { once } from 'xhr-mock';

import 'whatwg-fetch'; // fetch for Nodejs

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.toJson = toJson;

window.SVGPathElement = window.Element;
//var svgjs = require('svg.js')(window)

/**
 * Setup API mock
 */
mock.setup();
global.mockOnce = once;
global.apiClientMock = mock;

/**
 * Setup fetch mock
 */
global.fetchMock = fetchMock;

/**
 * setup ENV vars
 */
process.env.BASE_PATH = '/api/';

global.insights = {
    chrome: {
        auth: {
            getUser: () => new Promise(resolve => resolve(true))
        }
    }
};
