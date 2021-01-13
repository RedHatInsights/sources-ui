import React from 'react';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';

import { Card, Tile, Tooltip } from '@patternfly/react-core';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import CloudEmptyState from '../../../components/CloudTiles/CloudEmptyState';
import CloudTiles from '../../../components/CloudTiles/CloudTiles';

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
    expect(wrapper.find(CloudTiles)).toHaveLength(1);
    expect(wrapper.find(Tile)).toHaveLength(2);
    expect(wrapper.find('img')).toHaveLength(2);

    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });
});
