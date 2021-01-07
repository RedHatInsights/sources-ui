import React from 'react';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';

import { Card, Tile, Tooltip } from '@patternfly/react-core';

import componentWrapperIntl from '../../utilities/testsHelpers';
import CloudEmptyState from '../../components/CloudEmptyState';
import { MemoryRouter } from 'react-router-dom';
import { routes } from '../../Routes';

describe('CloudEmptyState', () => {
  let wrapper;
  let setSelectedType;
  let initialProps;
  let store;

  beforeEach(() => {
    setSelectedType = jest.fn();

    initialProps = {
      setSelectedType,
    };

    store = configureStore()({ user: { isOrgAdmin: true } });
  });

  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(Tile)).toHaveLength(2);
    expect(wrapper.find('img')).toHaveLength(2);

    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });

  it('renders correctly when no permissions', async () => {
    store = configureStore()({ user: { isOrgAdmin: false } });

    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(Tile)).toHaveLength(2);
    expect(wrapper.find('img')).toHaveLength(2);
    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(true);
    expect(wrapper.find(Tooltip)).toHaveLength(2);
    expect(wrapper.find(Tooltip).first().props().content).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
  });

  it('sets amazon', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('amazon');
  });

  it('sets azure', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).at(1).simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('azure');
  });

  it.skip('does not set gcp', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudEmptyState {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).last().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual('/');
    expect(setSelectedType).not.toHaveBeenCalled();
  });
});
