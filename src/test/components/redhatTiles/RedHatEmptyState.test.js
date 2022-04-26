import React from 'react';
import { render, screen } from '@testing-library/react';

import componentWrapperIntl from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';
import RedHatEmptyState from '../../../components/RedHatTiles/RedHatEmptyState';
import sourceTypes from '../../__mocks__/sourceTypesData';
import { REDHAT_VENDOR } from '../../../utilities/constants';

describe('RedhatEmptyState', () => {
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
      sources: { sourceTypes: sourceTypes.data, activeCategory: REDHAT_VENDOR },
    });
  });

  it('renders correctly', async () => {
    render(componentWrapperIntl(<RedHatEmptyState {...initialProps} />, store));

    expect(screen.getByText('OpenShift Container Platform')).toBeInTheDocument();
    expect(screen.getByAltText('red hat logo')).toBeInTheDocument();
  });
});
