import React from 'react';
import { act } from 'react-dom/test-utils';

import { Tooltip, Tile } from '@patternfly/react-core';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { MemoryRouter } from 'react-router-dom';
import { routes } from '../../../Routes';
import CloudTiles from '../../../components/CloudTiles/CloudTiles';
import mockStore from '../../__mocks__/mockStore';
import sourceTypes, { googleType } from '../../__mocks__/sourceTypesData';
import { CLOUD_VENDOR } from '../../../utilities/constants';

describe('CloudTiles', () => {
  let wrapper;
  let setSelectedType;
  let initialProps;
  let store;

  beforeEach(() => {
    setSelectedType = jest.fn();

    initialProps = {
      setSelectedType,
    };

    store = mockStore({
      user: { isOrgAdmin: true },
      sources: { sourceTypes: [...sourceTypes.data, googleType], activeVendor: CLOUD_VENDOR },
    });
  });

  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(CloudTiles)).toHaveLength(1);
    expect(wrapper.find(Tile)).toHaveLength(3);
    expect(wrapper.find('img')).toHaveLength(3);

    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });

  it('renders correctly when no permissions', async () => {
    store = mockStore({
      user: { isOrgAdmin: false },
      sources: { sourceTypes: [...sourceTypes.data, googleType], activeVendor: CLOUD_VENDOR },
    });

    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Tile)).toHaveLength(3);
    expect(wrapper.find('img')).toHaveLength(3);
    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(true);
    expect(wrapper.find(Tooltip)).toHaveLength(3);
    expect(wrapper.find(Tooltip).first().props().content).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
  });

  it('sets amazon', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('amazon');
  });

  it('sets gcp', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).at(1).simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('google');
  });

  it('sets azure', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<CloudTiles {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).last().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('azure');
  });
});
