import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { render, screen } from '@testing-library/react';

import { replaceRouteId, routes } from '../../../Routing';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import appTypes from '../../__mocks__/applicationTypes';
import DetailHeader from '../../../components/SourceDetail/DetailHeader';
import * as formatters from '../../../views/formatters';
import mockStore from '../../__mocks__/mockStore';

describe('DetailHeader', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    formatters.availabilityFormatter = jest.fn();

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this source' }],
        appTypes,
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<DetailHeader />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getAllByText('Name of this source')).toHaveLength(2);
    expect(screen.getByText('View details and manage connections for this source.')).toBeInTheDocument();
    expect(screen.getByLabelText('Actions')).toBeInTheDocument();

    expect(formatters.availabilityFormatter).toHaveBeenCalledWith(
      undefined,
      { id: sourceId, name: 'Name of this source' },
      { appTypes },
    );
  });
});
