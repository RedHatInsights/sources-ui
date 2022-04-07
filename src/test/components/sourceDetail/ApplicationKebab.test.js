import React from 'react';
import { Route } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';
import ApplicationKebab from '../../../components/SourceDetail/ApplicationKebab';

describe('ApplicationKebab', () => {
  let store;

  let removeApp;
  let addApp;
  let app;

  let initialProps;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  beforeEach(() => {
    removeApp = jest.fn();
    addApp = jest.fn();
    app = {
      id: 'app-id',
    };

    initialProps = { removeApp, addApp, app };
  });

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
        store,
        initialEntry
      )
    );

    await userEvent.click(screen.getByLabelText('Actions'));

    expect(screen.getByText('Pause')).toBeInTheDocument();
    expect(screen.getByText('Temporarily stop this application from collecting data.')).toBeInTheDocument();
    expect(screen.getByText('Pause').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(screen.getByText('Permanently stop data collection for this application.')).toBeInTheDocument();
    expect(screen.getByText('Remove').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    await userEvent.hover(screen.getByText('Remove'));

    const tooltipText =
      'To perform this action, you must be granted Sources Administrator permissions from your Organization Administrator.';

    await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
  });

  it('renders with no permissions and paused', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { writePermissions: false },
    });

    app = {
      ...app,
      paused_at: 'today',
    };

    initialProps = { ...initialProps, app };

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
        store,
        initialEntry
      )
    );

    await userEvent.click(screen.getByLabelText('Actions'));

    expect(screen.getByText('Resume')).toBeInTheDocument();
    expect(screen.getByText('Resume data collection for this application.')).toBeInTheDocument();
    expect(screen.getByText('Resume').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    expect(screen.getByText('Remove')).toBeInTheDocument();
    expect(screen.getByText('Permanently stop data collection for this application.')).toBeInTheDocument();
    expect(screen.getByText('Remove').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

    await userEvent.hover(screen.getByText('Remove'));

    const tooltipText =
      'To perform this action, you must be granted Sources Administrator permissions from your Organization Administrator.';

    await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
  });

  describe('with permissions and unpaused', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [{ id: sourceId }],
        },
        user: { writePermissions: true },
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
          store,
          initialEntry
        )
      );
    });

    it('renders correctly', async () => {
      await userEvent.click(screen.getByLabelText('Actions'));

      expect(screen.getByText('Pause')).toBeInTheDocument();
      expect(screen.getByText('Temporarily stop this application from collecting data.')).toBeInTheDocument();
      expect(screen.getByText('Pause').closest('.src-m-dropdown-item-disabled')).toBeNull();

      expect(screen.getByText('Remove')).toBeInTheDocument();
      expect(screen.getByText('Permanently stop data collection for this application.')).toBeInTheDocument();
      expect(screen.getByText('Remove').closest('.src-m-dropdown-item-disabled')).toBeNull();
    });

    it('remove application', async () => {
      await userEvent.click(screen.getByLabelText('Actions'));
      await userEvent.click(screen.getByText('Remove'));

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', app.id)
      );
    });

    it('pause application', async () => {
      await userEvent.click(screen.getByLabelText('Actions'));
      await userEvent.click(screen.getByText('Pause'));

      expect(removeApp).toHaveBeenCalled();
    });
  });

  describe('paused source', () => {
    it('renders correctly', async () => {
      store = mockStore({
        sources: {
          entities: [{ id: sourceId, paused_at: 'now' }],
        },
        user: { writePermissions: true },
      });

      app = {
        ...app,
        paused_at: 'today',
      };

      initialProps = { ...initialProps, app };

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
          store,
          initialEntry
        )
      );

      await userEvent.click(screen.getByLabelText('Actions'));

      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Resume data collection for this application.')).toBeInTheDocument();
      expect(screen.getByText('Resume').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

      expect(screen.getByText('Remove')).toBeInTheDocument();
      expect(screen.getByText('Permanently stop data collection for this application.')).toBeInTheDocument();
      expect(screen.getByText('Remove').closest('.src-m-dropdown-item-disabled')).toBeInTheDocument();

      await userEvent.hover(screen.getByText('Resume'));

      const tooltipText = 'You cannot perform this action on a paused source.';

      await waitFor(() => expect(screen.getByText(tooltipText)).toBeInTheDocument());
    });
  });

  describe('with permissions and paused', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [{ id: sourceId }],
        },
        user: { writePermissions: true },
      });

      app = {
        ...app,
        paused_at: 'today',
      };

      initialProps = { ...initialProps, app };

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
          store,
          initialEntry
        )
      );
    });

    it('renders correctly', async () => {
      await userEvent.click(screen.getByLabelText('Actions'));

      expect(screen.getByText('Resume')).toBeInTheDocument();
      expect(screen.getByText('Resume data collection for this application.')).toBeInTheDocument();
      expect(screen.getByText('Resume').closest('.src-m-dropdown-item-disabled')).toBeNull();

      expect(screen.getByText('Remove')).toBeInTheDocument();
      expect(screen.getByText('Permanently stop data collection for this application.')).toBeInTheDocument();
      expect(screen.getByText('Remove').closest('.src-m-dropdown-item-disabled')).toBeNull();
    });

    it('remove application', async () => {
      await userEvent.click(screen.getByLabelText('Actions'));
      await userEvent.click(screen.getByText('Remove'));

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', app.id)
      );
    });

    it('resume application', async () => {
      await userEvent.click(screen.getByLabelText('Actions'));
      await userEvent.click(screen.getByText('Resume'));

      expect(addApp).toHaveBeenCalled();
    });
  });
});
