import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import CloudCards, { CLOUD_CARDS_KEY } from '../../../components/CloudTiles/CloudCards';

import componentWrapperIntl from '../../../utilities/testsHelpers';

describe('CloudCards', () => {
  let localStorage;
  let protoTmp;
  let initialProps;

  beforeEach(() => {
    protoTmp = Storage;

    localStorage = {};

    Object.assign(Storage, {});
    Storage.prototype.getItem = jest.fn((name) => localStorage[name]);
    Storage.prototype.setItem = jest.fn((name, value) => {
      localStorage[name] = value ? 'true' : 'false';
    });
    initialProps = {
      setSelectedType: jest.fn(),
    };
  });

  afterEach(() => {
    Object.assign(Storage, protoTmp);
  });

  it('renders correctly and sets local storage', async () => {
    render(componentWrapperIntl(<CloudCards {...initialProps} />));

    expect(screen.getByLabelText('Trend up icon')).toBeInTheDocument();
    expect(screen.getByLabelText('List icon')).toBeInTheDocument();
    expect(screen.getByLabelText('Builder image icon')).toBeInTheDocument();

    expect(screen.getByText('I connected to cloud. Now what?')).toBeInTheDocument();

    expect(screen.getByText('Use gold images')).toBeInTheDocument();
    expect(screen.getByText('Explore Red Hat Insights')).toBeInTheDocument();
    expect(screen.getByText('Track usage with Subscriptions')).toBeInTheDocument();

    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'true',
    });
  });

  it('renders correctly when storage is false', async () => {
    localStorage[CLOUD_CARDS_KEY] = 'false';

    render(componentWrapperIntl(<CloudCards {...initialProps} />));

    expect(() => screen.getByLabelText('Trend up icon')).toThrow();
    expect(() => screen.getByLabelText('List icon')).toThrow();
    expect(() => screen.getByLabelText('Builder image icon')).toThrow();

    expect(screen.getByText('I connected to cloud. Now what?')).toBeInTheDocument();

    expect(() => screen.getByText('Use gold images')).toThrow();
    expect(() => screen.getByText('Explore Red Hat Insights')).toThrow();
    expect(() => screen.getByText('Track usage with Subscriptions')).toThrow();

    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'false',
    });
  });

  it('hides card', async () => {
    render(componentWrapperIntl(<CloudCards {...initialProps} />));

    expect(screen.getByText('Use gold images')).toBeInTheDocument();

    userEvent.click(screen.getByRole('button'));

    expect(() => screen.getByText('Use gold images')).toThrow();

    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'false',
    });

    userEvent.click(screen.getByRole('button'));

    expect(screen.getByText('Use gold images')).toBeInTheDocument();
    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'true',
    });
  });
});
