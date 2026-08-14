import React from 'react';
import { cleanup, render } from '@testing-library/react';

import App from '../App';
import { componentWrapperIntl } from '../utilities/testsHelpers';
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
