import { configure, mount, render, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import 'babel-polyfill';
import toJson from 'enzyme-to-json';
import fetchMock from 'fetch-mock';

import 'unfetch/polyfill'; // work around an issue in insights-ui-components

configure({ adapter: new Adapter() });

global.shallow = shallow;
global.render = render;
global.mount = mount;
global.React = React;
global.fetchMock = fetchMock;
global.toJson = toJson;

window.SVGPathElement = window.Element;
//var svgjs = require('svg.js')(window)
