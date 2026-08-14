import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { Route, Routes } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../routes';
import AvailabilityChecker from '../../../components/SourceDetail/AvailabilityChecker';
import * as api from '../../../api/checkSourceStatus';
import mockStore from '../../__mocks__/mockStore';
import notificationsStore from '../../../utilities/notificationsStore';

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
        initialEntry,
      ),
    );

    expect(screen.getByLabelText('Check integration availability')).not.toBeDisabled();
    expect(() => screen.getByRole('progressbar')).toThrow();
    expect(screen.getByTestId('RedoIcon')).toBeInTheDocument();
  });

  it('checks status (click > loading > message)', async () => {
    const user = userEvent.setup();
    const addNotificationSpy = jest.spyOn(notificationsStore, 'addNotification');

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<AvailabilityChecker />} />
        </Routes>,
        store,
        initialEntry,
      ),
    );

    api.default = mockApi();

    expect(screen.getByLabelText('Check integration availability')).not.toBeDisabled();

    await waitFor(async () => {
      await user.click(screen.getByLabelText('Check integration availability'));
    });

    expect(api.default).toHaveBeenCalledWith(sourceId);
    expect(screen.getByLabelText('Check integration availability')).toBeDisabled();
    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    api.default.resolve();

    await waitFor(() => expect(screen.getByLabelText('Check integration availability')).not.toBeDisabled());
    expect(() => screen.getByRole('progressbar')).toThrow();

    expect(addNotificationSpy).toHaveBeenCalledWith({
      title: 'Request to check integration status was sent',
      variant: 'info',
      description: 'Check this page later for updates',
    });
  });
});
