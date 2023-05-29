import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { replaceRouteId, routes } from '../../../Routing';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import Breadcrumbs from '../../../components/SourceDetail/Breadcrumbs';
import mockStore from '../../__mocks__/mockStore';

describe('Breadcrumbs', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  beforeEach(() => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Somename' }],
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<Breadcrumbs />} />
        </Routes>,
        store,
        initialEntry
      )
    );
  });

  it('renders correctly', async () => {
    expect(screen.getByText('Sources')).toBeInTheDocument();
    expect(screen.getByText('Somename')).toBeInTheDocument();
  });

  it('goes back to sources', async () => {
    const user = userEvent.setup();

    await user.click(screen.getByText('Sources'));

    expect(screen.getByTestId('location-display').textContent).toEqual(`/settings/sources${routes.sources.path}`);
  });
});
