import React from 'react';
import { render } from '@testing-library/react';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import CloudEmptyState from '../../../components/CloudTiles/CloudEmptyState';
import mockStore from '../../__mocks__/mockStore';
import sourceTypes from '../../__mocks__/sourceTypes';
import { CLOUD_VENDOR } from '../../../utilities/constants';

describe('CloudEmptyState', () => {
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
      sources: { sourceTypes, activeCategory: CLOUD_VENDOR },
    });
  });

  it('renders correctly', async () => {
    const { container } = render(componentWrapperIntl(<CloudEmptyState {...initialProps} />, store));

    expect([...container.getElementsByClassName('pf-c-tile__title')].map((e) => e.textContent)).toEqual([
      'Amazon Web Services',
      'Google Cloud',
      'IBM Cloud',
      'Microsoft Azure',
      'Oracle Cloud Infrastructure',
    ]);
    expect(container.getElementsByTagName('img')).toHaveLength(5);
  });
});
