import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import App from '../App';
import { LocationDisplay, componentWrapperIntl } from '../utilities/testsHelpers';
import { routes } from '../Routing';
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
  beforeEach(() => {
    PermissionsChecker.default = ({ children }) => <h1>{children}</h1>;
    DataLoader.default = ({ children }) => <span>{children}</span>;
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

      render(componentWrapperIntl(<App />));

      expect(screen.getByTestId('testurl').textContent).toEqual('/');
      expect(screen.getByTestId('testurl').textContent).toEqual(routes.sources.path);
    });

    it('goes to sources on chrome nav event when source [olderEnv]', async () => {
      DataLoader.default = () => <LocationDisplay id="testurl" />;

      render(componentWrapperIntl(<App />));

      expect(screen.getByTestId('testurl').textContent).toEqual('/');
      expect(screen.getByTestId('testurl').textContent).toEqual(routes.sources.path);
    });

    it('stays same when chrom nav event is not sources', async () => {
      DataLoader.default = () => <LocationDisplay id="testurl" />;

      render(componentWrapperIntl(<App />));

      expect(screen.getByTestId('testurl').textContent).toEqual('/');
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

    await cleanup();

    expect(localStorage).toEqual({});

    Object.assign(Storage, protoTmp);
  });
});
