import React from 'react';
import NotificationsPortal from '@redhat-cloud-services/frontend-components-notifications/NotificationPortal';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';

import App from '../App';
import { componentWrapperIntl } from '../utilities/testsHelpers';
import Routes from '../Routes';
import { getProdStore } from '../utilities/store';
import * as PermissionsChecker from '../components/PermissionsChecker';
import * as DataLoader from '../components/DataLoader';
import { CLOUD_CARDS_KEY } from '../components/CloudTiles/CloudCards';

import ErrorBoundary from '../components/ErrorBoundary';

jest.mock('../pages/Sources', () => ({
  __esModule: true,
  default: () => {
    return <div></div>;
  },
}));

describe('App spec js', () => {
  const tmpInsights = insights;

  let initSpy;
  let identifyAppSpy;

  beforeEach(() => {
    initSpy = jest.fn();
    identifyAppSpy = jest.fn();

    PermissionsChecker.default = ({ children }) => <h1>{children}</h1>;
    DataLoader.default = ({ children }) => <span>{children}</span>;

    insights = {
      chrome: {
        ...insights.chrome,
        init: initSpy,
        identifyApp: identifyAppSpy,
      },
    };
  });

  afterEach(() => {
    insights = tmpInsights;
  });

  it('inits chrome', () => {
    mount(componentWrapperIntl(<App />));

    expect(initSpy).toHaveBeenCalled();
    expect(identifyAppSpy).toHaveBeenCalledWith('sources');
  });

  it('unmounts app and clears localStorage', async () => {
    let localStorage;
    let protoTmp;
    let wrapper;

    protoTmp = Storage;

    localStorage = {
      [CLOUD_CARDS_KEY]: 'some-value',
    };

    Object.assign(Storage, {});
    Storage.prototype.removeItem = jest.fn((name) => {
      delete localStorage[name];
    });

    await act(async () => {
      wrapper = mount(componentWrapperIntl(<App />));
    });
    wrapper.update();

    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'some-value',
    });

    await act(async () => {
      wrapper.unmount();
    });

    expect(localStorage).toEqual({});

    Object.assign(Storage, protoTmp);
  });

  it('inits chrome with error', () => {
    const tmpLog = console.warn;
    const spyConsoleWarn = jest.fn();
    console.warn = spyConsoleWarn;

    const spyThrowError = jest.fn().mockImplementation(() => {
      throw 'error';
    });

    insights = {
      chrome: {
        ...insights.chrome,
        init: initSpy,
        identifyApp: spyThrowError,
      },
    };

    mount(componentWrapperIntl(<App />));

    expect(initSpy).toHaveBeenCalled();
    expect(spyThrowError).toHaveBeenCalledWith('sources');
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.any(String));

    console.warn = tmpLog;
  });

  it('renders correctly', async () => {
    let wrapper;

    await act(async () => {
      wrapper = mount(componentWrapperIntl(<App />, getProdStore(), ['']));
    });

    expect(wrapper.find(NotificationsPortal)).toHaveLength(1);
    expect(wrapper.find(Main)).toHaveLength(1);
    expect(wrapper.find(Routes)).toHaveLength(1);
    expect(wrapper.find(Router)).toHaveLength(1);
    expect(wrapper.find(Router).props().basename).toEqual('/');
    expect(wrapper.find(PermissionsChecker.default)).toHaveLength(1);
    expect(wrapper.find(DataLoader.default)).toHaveLength(1);
    expect(wrapper.find(ErrorBoundary)).toHaveLength(1);
  });
});
