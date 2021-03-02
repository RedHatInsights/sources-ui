import React from 'react';
import { act } from 'react-dom/test-utils';

import { Tooltip } from '@patternfly/react-core/dist/esm/components/Tooltip/Tooltip';
import { Tile } from '@patternfly/react-core/dist/esm/components/Tile/Tile';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import { MemoryRouter } from 'react-router-dom';
import { routes } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';
import RedHatTiles from '../../../components/RedHatTiles/RedHatTiles';
import sourceTypes from '../../__mocks__/sourceTypesData';
import * as constants from '../../../utilities/constants';

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

    store = mockStore({ user: { isOrgAdmin: true }, sources: { sourceTypes: sourceTypes.data } });

    constants.getActiveVendor = () => constants.REDHAT_VENDOR;
  });

  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Tile)).toHaveLength(2);
    expect(wrapper.find('img')).toHaveLength(2);

    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });

  it('renders correctly when no permissions', async () => {
    store = mockStore({ user: { isOrgAdmin: false }, sources: { sourceTypes: sourceTypes.data } });

    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Tile)).toHaveLength(2);
    expect(wrapper.find('img')).toHaveLength(2);
    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(Tile).last().props().isDisabled).toEqual(true);
    expect(wrapper.find(Tooltip)).toHaveLength(2);
    expect(wrapper.find(Tooltip).first().props().content).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
  });

  it('sets ansible', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).first().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('ansible-tower');
  });

  it('sets openshift', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatTiles {...initialProps} />, store));
    });
    wrapper.update();

    await act(async () => {
      wrapper.find(Tile).at(1).simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sourcesNew.path);
    expect(setSelectedType).toHaveBeenCalledWith('openshift');
  });
});
