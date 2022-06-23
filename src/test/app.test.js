import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import App from '../App';
import { LocationDisplay, componentWrapperIntl } from '../utilities/testsHelpers';
import { routes } from '../Routes';
import * as PermissionsChecker from '../components/PermissionsChecker';
import * as DataLoader from '../components/DataLoader';
import { CLOUD_CARDS_KEY } from '../components/CloudTiles/CloudCards';

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
  let on;
  let unregister;
  let callbackState;

  beforeEach(() => {
    initSpy = jest.fn();
    identifyAppSpy = jest.fn();
    unregister = jest.fn();
    on = jest.fn().mockImplementation((_name, callback) => {
      callbackState = callback;
      return unregister;
    });

    PermissionsChecker.default = ({ children }) => <h1>{children}</h1>;
    DataLoader.default = ({ children }) => <span>{children}</span>;

    insights = {
      chrome: {
        ...insights.chrome,
        init: initSpy,
        identifyApp: identifyAppSpy,
        on,
      },
    };
  });

  afterEach(() => {
    insights = tmpInsights;
  });

  it('inits chrome', () => {
    render(componentWrapperIntl(<App />));

    expect(initSpy).toHaveBeenCalled();
    expect(identifyAppSpy).toHaveBeenCalledWith('sources');
    expect(on).toHaveBeenCalledWith('APP_NAVIGATION', expect.any(Function));
  });

  describe('global nav event', () => {
    let tmpLocation;

    beforeEach(() => {
      tmpLocation = Object.assign({}, window.location);

      delete window.location;

      window.location = {
        assign: jest.fn(),
        replace: jest.fn(),
        reload: jest.fn(),
        href: 'http://localhost/',
        toString: jest.fn(),
        origin: 'http://localhost',
        protocol: 'http:',
        host: 'localhost',
        hostname: 'localhost',
        port: '',
        pathname: '/',
        search: '',
        hash: '',
      };
    });

    afterEach(() => {
      window.location = tmpLocation;
    });

    it('goes to sources on chrome nav event when source', async () => {
      DataLoader.default = () => <LocationDisplay id="testurl" />;

      const event = { navId: '/', domEvent: { href: '/beta/settings/sources' } };
      render(componentWrapperIntl(<App />));

      expect(screen.getByTestId('testurl').textContent).toEqual('/');

      callbackState(event);

      expect(screen.getByTestId('testurl').textContent).toEqual(routes.sources.path);
    });

    it('goes to sources on chrome nav event when source [olderEnv]', async () => {
      DataLoader.default = () => <LocationDisplay id="testurl" />;

      const event = { navId: 'sources', domEvent: { href: '/beta/settings/catalog' } };
      render(componentWrapperIntl(<App />));

      expect(screen.getByTestId('testurl').textContent).toEqual('/');

      callbackState(event);

      expect(screen.getByTestId('testurl').textContent).toEqual(routes.sources.path);
    });

    it('stays same when chrom nav event is not sources', async () => {
      DataLoader.default = () => <LocationDisplay id="testurl" />;

      const event = { navId: '/', domEvent: { href: '/beta/settings/catalog' } };
      render(componentWrapperIntl(<App />));

      expect(screen.getByTestId('testurl').textContent).toEqual('/');

      callbackState(event);

      expect(screen.getByTestId('testurl').textContent).toEqual('/');
    });
  });

  it('unrenders app and clears localStorage', async () => {
    let localStorage;
    let protoTmp;

    protoTmp = Storage;

    localStorage = {
      [CLOUD_CARDS_KEY]: 'some-value',
    };

    Object.assign(Storage, {});
    Storage.prototype.removeItem = jest.fn((name) => {
      delete localStorage[name];
    });

    render(componentWrapperIntl(<App />));

    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'some-value',
    });
    expect(unregister).not.toHaveBeenCalled();

    await cleanup();

    expect(localStorage).toEqual({});
    expect(unregister).toHaveBeenCalled();

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

    render(componentWrapperIntl(<App />));

    expect(initSpy).toHaveBeenCalled();
    expect(spyThrowError).toHaveBeenCalledWith('sources');
    expect(spyConsoleWarn).toHaveBeenCalledWith(expect.any(String));

    console.warn = tmpLog;
  });
});
