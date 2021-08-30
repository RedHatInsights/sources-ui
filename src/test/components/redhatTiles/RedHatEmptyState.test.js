import React from 'react';
import { act } from 'react-dom/test-utils';

import { Card, Tooltip, Tile } from '@patternfly/react-core';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';
import RedHatEmptyState from '../../../components/RedHatTiles/RedHatEmptyState';
import RedHatTiles from '../../../components/RedHatTiles/RedHatTiles';
import sourceTypes from '../../__mocks__/sourceTypesData';
import { REDHAT_VENDOR } from '../../../utilities/constants';

describe('RedhatEmptyState', () => {
  let wrapper;
  let setSelectedType;
  let initialProps;
  let store;

  beforeEach(() => {
    setSelectedType = jest.fn();

    initialProps = {
      setSelectedType,
    };

    store = mockStore({ user: { writePermissions: true }, sources: { sourceTypes: sourceTypes.data }, activeVendor: REDHAT_VENDOR });
  });

  it('renders correctly', async () => {
    await act(async () => {
      wrapper = mount(componentWrapperIntl(<RedHatEmptyState {...initialProps} />, store));
    });
    wrapper.update();

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(RedHatTiles)).toHaveLength(1);
    expect(wrapper.find(Tile)).toHaveLength(1);
    expect(wrapper.find('img')).toHaveLength(1);

    expect(wrapper.find(Tile).first().props().isDisabled).toEqual(undefined);
    expect(wrapper.find(Tooltip)).toHaveLength(0);
  });
});
