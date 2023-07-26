import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { Route, Routes } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routing';
import AvailabilityChecker from '../../../components/SourceDetail/AvailabilityChecker';
import * as api from '../../../api/checkSourceStatus';
import * as actions from '../../../redux/sources/actions';
import mockStore from '../../__mocks__/mockStore';

describe('AvailabilityChecker', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  beforeEach(() => {
    store = mockStore({ sources: { entities: [{ id: sourceId }] } });
  });

  it('renders correctly', () => {
    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<AvailabilityChecker />} />
        </Routes>,
        store,
        initialEntry
      )
    );

    expect(screen.getByLabelText('Check source availability')).not.toBeDisabled();
    expect(() => screen.getByRole('progressbar')).toThrow();
    expect(screen.getByTestId('RedoIcon')).toBeInTheDocument();
  });

  it('checks status (click > loading > message)', async () => {
    const user = userEvent.setup();

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<AvailabilityChecker />} />
        </Routes>,
        store,
        initialEntry
      )
    );

    api.default = mockApi();
    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'something' }));

    expect(screen.getByLabelText('Check source availability')).not.toBeDisabled();

    await user.click(screen.getByLabelText('Check source availability'));

    expect(api.default).toHaveBeenCalledWith(sourceId);
    expect(screen.getByLabelText('Check source availability')).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    api.default.resolve();

    await waitFor(() => expect(screen.getByLabelText('Check source availability')).not.toBeDisabled());
    expect(() => screen.getByRole('progressbar')).toThrow();

    expect(actions.addMessage).toHaveBeenCalledWith({
      title: 'Request to check source status was sent',
      variant: 'info',
      description: 'Check this page later for updates',
    });
  });
});
