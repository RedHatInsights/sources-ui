import React from 'react';
import { act } from 'react-dom/test-utils';

import { Tooltip, Tile } from '@patternfly/react-core';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { MemoryRouter } from 'react-router-dom';
import { routes } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';
import RedHatTiles from '../../../components/RedHatTiles/RedHatTiles';
import sourceTypes from '../../__mocks__/sourceTypesData';
import { REDHAT_VENDOR } from '../../../utilities/constants';

describe('RedhatTiles', () => {
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
      user: { writePermissions: true },
      sources: { sourceTypes: sourceTypes.data, activeVendor: REDHAT_VENDOR },
    });
  });

  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Tile)).toHaveLength(1);
    expect(wrapper.find('img')).toHaveLength(1);

    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });

  it('renders correctly when no permissions', async () => {
    store = mockStore({ user: { writePermissions: false }, sources: { sourceTypes: sourceTypes.data } });

    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Tile)).toHaveLength(1);
    expect(wrapper.find('img')).toHaveLength(1);
    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(Tooltip)).toHaveLength(1);
    expect(wrapper.find(Tooltip).first().props().content).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
  });

  it('sets openshift', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).at(0).simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('openshift');
  });
});
