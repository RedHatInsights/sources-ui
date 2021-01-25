import React from 'react';
import { act } from 'react-dom/test-utils';

import { Card, CardHeader } from '@patternfly/react-core';
import PlusIcon from '@patternfly/react-icons/dist/js/icons/plus-icon';

import CloudCards, { CLOUD_CARDS_KEY } from '../../../components/CloudTiles/CloudCards';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import CloudTiles from '../../../components/CloudTiles/CloudTiles';

describe('CloudCards', () => {
  let wrapper;
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
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudCards {...initialProps} />));
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(2);
    expect(wrapper.find(CloudTiles)).toHaveLength(1);
    expect(wrapper.find('img')).toHaveLength(3);
    expect(wrapper.find(PlusIcon)).toHaveLength(3);

    expect(wrapper.find(Card).first().props().isExpanded).toEqual(true);
    expect(wrapper.find(Card).last().props().isExpanded).toEqual(true);

    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'true',
    });
  });

  it('renders correctly when storage is false', async () => {
    localStorage[CLOUD_CARDS_KEY] = 'false';

    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudCards {...initialProps} />));
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(2);
    expect(wrapper.find('img')).toHaveLength(0);
    expect(wrapper.find(PlusIcon)).toHaveLength(0);

    expect(wrapper.find(Card).first().props().isExpanded).toEqual(false);
    expect(wrapper.find(Card).last().props().isExpanded).toEqual(false);

    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'false',
    });
  });

  it('hides both card at once', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudCards {...initialProps} />));
    });
    wrapper.update();

    expect(wrapper.find(Card).first().props().isExpanded).toEqual(true);
    expect(wrapper.find(Card).last().props().isExpanded).toEqual(true);

    await act(async () => {
      wrapper.find(CardHeader).first().find('button').simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(Card).first().props().isExpanded).toEqual(false);
    expect(wrapper.find(Card).last().props().isExpanded).toEqual(false);
    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'false',
    });

    await act(async () => {
      wrapper.find(CardHeader).last().find('button').simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(Card).first().props().isExpanded).toEqual(true);
    expect(wrapper.find(Card).last().props().isExpanded).toEqual(true);
    expect(localStorage).toEqual({
      [CLOUD_CARDS_KEY]: 'true',
    });
  });
});
