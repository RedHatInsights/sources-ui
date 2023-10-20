import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { act, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import { ACCOUNT_AUTHORIZATION } from '../../../components/constants';
import ApplicationsCard from '../../../components/SourceDetail/ApplicationsCard';
import { replaceRouteId, routes } from '../../../Routing';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypes, { AMAZON_TYPE } from '../../__mocks__/sourceTypes';
import appTypes, { COST_MANAGEMENT_APP, SUB_WATCH_APP } from '../../__mocks__/applicationTypes';
import mockStore from '../../__mocks__/mockStore';

import * as api from '../../../api/entities';
import * as actions from '../../../redux/sources/actions';

describe('ApplicationsCard', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    const user = userEvent.setup();

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, source_type_id: AMAZON_TYPE.id, applications: [] }],
        sourceTypes,
        appTypes,
        hcsEnrolledLoaded: true,
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
        </Routes>,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);

    expect(screen.getAllByText('Cost Management')).toBeTruthy();
    expect(screen.getAllByRole('checkbox')[0]).toBeDisabled();

    expect(screen.getAllByText('RHEL management')).toBeTruthy();
    expect(screen.getAllByRole('checkbox')[1]).toBeDisabled();

    await waitFor(async () => {
      await user.hover(screen.getByText('Cost Management', { selector: '.pf-m-off' }));
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          'To perform this action, your Organization Administrator must grant you Sources Administrator permissions.'
        )
      ).toBeInTheDocument()
    );
  });

  it('renders paused source', () => {
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_TYPE.id,
            applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id }],
            paused_at: 'today',
          },
        ],
        sourceTypes,
        appTypes,
        hcsEnrolledLoaded: true,
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Routes>
          <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
        </Routes>,
        store,
        initialEntry
      )
    );

    expect(screen.getAllByRole('checkbox')).toHaveLength(2);
    expect(screen.getAllByRole('checkbox')[0]).toBeDisabled();
    expect(screen.getAllByRole('checkbox')[1]).toBeDisabled();
  });

  describe('with permissions', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_TYPE.id,
              applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id }],
            },
          ],
          sourceTypes,
          appTypes,
          hcsEnrolledLoaded: true,
        },
        user: { writePermissions: true },
      });

      actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'undefined' }));
    });

    it('renders correctly', () => {
      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      expect(screen.getByText('Applications')).toBeInTheDocument();

      expect(screen.getAllByText('Cost Management')).toBeTruthy();
      expect(screen.getAllByText('RHEL management')).toBeTruthy();

      expect(screen.getByLabelText('Actions')).toBeInTheDocument();

      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
      expect(screen.getAllByRole('checkbox')[0]).not.toBeDisabled();
      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      expect(screen.getAllByRole('checkbox')[1]).not.toBeDisabled();
      expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();
    });

    it('pause application', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));
      const pauseApplication = mockApi();

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      expect(pauseApplication).toHaveBeenCalledWith('123');
      pauseApplication.mockClear();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(pauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      pauseApplication.resolve();

      await waitFor(() => expect(actions.loadEntities).toHaveBeenCalled());
    });

    it('add application', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[1]);
      });

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(`/settings/integrations/${routes.sourcesDetailAddApp.path}`, sourceId).replace(
          ':app_type_id',
          SUB_WATCH_APP.id
        )
      );
    });

    it('unpause application', async () => {
      const user = userEvent.setup();

      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_TYPE.id,
              applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id, paused_at: 'today' }],
            },
          ],
          sourceTypes,
          appTypes: [COST_MANAGEMENT_APP],
          hcsEnrolledLoaded: true,
        },
        user: { writePermissions: true },
      });

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

      const unpauseApplication = mockApi();

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      expect(unpauseApplication).toHaveBeenCalledWith('123');
      unpauseApplication.mockClear();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(unpauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      unpauseApplication.resolve();

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          customIcon: <PlayIcon />,
          title: 'Cost Management connection resumed',
          variant: 'default',
        })
      );
      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('unpause application and fails', async () => {
      const user = userEvent.setup();

      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_TYPE.id,
              applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id, paused_at: 'today' }],
            },
          ],
          sourceTypes,
          appTypes: [COST_MANAGEMENT_APP],
          hcsEnrolledLoaded: true,
        },
        user: { writePermissions: true },
      });

      const unpauseApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application resume failed',
          variant: 'danger',
        })
      );
    });

    it('unpause application via dropdown', async () => {
      const user = userEvent.setup();

      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_TYPE.id,
              applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id, paused_at: 'today' }],
            },
          ],
          sourceTypes,
          appTypes: [COST_MANAGEMENT_APP],
          hcsEnrolledLoaded: true,
        },
        user: { writePermissions: true },
      });

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));
      const unpauseApplication = jest.fn().mockImplementation(() => Promise.resolve('ok'));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      await waitFor(async () => {
        await user.click(screen.getByLabelText('Actions'));
      });
      await waitFor(async () => {
        await user.click(screen.getByText('Resume'));
      });

      await waitFor(() => expect(unpauseApplication).toHaveBeenCalledWith('123'));
      expect(actions.addMessage).toHaveBeenCalledWith({
        customIcon: <PlayIcon />,
        title: 'Cost Management connection resumed',
        variant: 'default',
      });
      expect(actions.loadEntities).toHaveBeenCalled();
    });
  });

  describe('super key variant', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_TYPE.id,
              applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id }],
              app_creation_workflow: ACCOUNT_AUTHORIZATION,
            },
          ],
          sourceTypes,
          appTypes,
          hcsEnrolledLoaded: true,
        },
        user: { writePermissions: true },
      });

      actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'undefined' }));
      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));
    });

    it('unpaused application and blocks clicking again', async () => {
      const user = userEvent.setup();

      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_TYPE.id,
              applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id, paused_at: 'today' }],
              app_creation_workflow: ACCOUNT_AUTHORIZATION,
            },
          ],
          sourceTypes,
          appTypes: [COST_MANAGEMENT_APP],
          hcsEnrolledLoaded: true,
        },
        user: { writePermissions: true },
      });

      const unpauseApplication = mockApi();

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      expect(unpauseApplication).toHaveBeenCalledWith('123');
      unpauseApplication.mockClear();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(unpauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      unpauseApplication.resolve();

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          customIcon: <PlayIcon />,
          title: 'Cost Management connection resumed',
          variant: 'default',
        })
      );
      await waitFor(() => expect(actions.loadEntities).toHaveBeenCalled());
    });

    it('adds application and fail', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      api.doCreateApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));
      actions.addMessage.mockClear();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[1]);
      });

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application create failed',
          variant: 'danger',
        })
      );
    });

    it('pauses application and fail', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      const pauseApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));

      actions.addMessage.mockClear();

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application pause failed',
          variant: 'danger',
        })
      );
    });

    it('resumes application and fail', async () => {
      const user = userEvent.setup();

      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_TYPE.id,
              applications: [{ id: '123', application_type_id: COST_MANAGEMENT_APP.id, paused_at: 'today' }],
              app_creation_workflow: ACCOUNT_AUTHORIZATION,
            },
          ],
          sourceTypes,
          appTypes: [COST_MANAGEMENT_APP],
          hcsEnrolledLoaded: true,
        },
        user: { writePermissions: true },
      });

      const unpauseApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      actions.addMessage.mockClear();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application resume failed',
          variant: 'danger',
        })
      );
    });

    it('adds application', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      api.doCreateApplication = mockApi();

      expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[1]);
      });

      expect(screen.getAllByRole('checkbox')[1]).toBeChecked();

      expect(api.doCreateApplication).toHaveBeenCalledWith({
        application_type_id: SUB_WATCH_APP.id,
        source_id: sourceId,
      });
      expect(actions.loadEntities).not.toHaveBeenCalled();

      api.doCreateApplication.resolve();

      await waitFor(() => expect(actions.loadEntities).toHaveBeenCalled());
    });

    it('pause application and blocks clicking again', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      const pauseApplication = mockApi();

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      actions.addMessage.mockClear();

      await act(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      expect(pauseApplication).toHaveBeenCalledWith('123');
      pauseApplication.mockClear();

      await waitFor(async () => {
        await user.click(screen.getAllByRole('checkbox')[0]);
      });

      expect(pauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      pauseApplication.resolve();

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          customIcon: <PauseIcon />,
          description: 'Your application will not reflect the most recent data until Cost Management connection is resumed',
          title: 'Cost Management connection paused',
          variant: 'default',
        })
      );
      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('pause application via dropdown', async () => {
      const user = userEvent.setup();

      render(
        componentWrapperIntl(
          <Routes>
            <Route path={routes.sourcesDetail.path} element={<ApplicationsCard />} />
          </Routes>,
          store,
          initialEntry
        )
      );

      const pauseApplication = jest.fn().mockImplementation(() => Promise.resolve('ok'));

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      await waitFor(async () => {
        await user.click(screen.getByLabelText('Actions'));
      });
      await waitFor(async () => {
        await user.click(screen.getByText('Pause'));
      });

      expect(pauseApplication).toHaveBeenCalled();
      await waitFor(() => expect(actions.loadEntities).toHaveBeenCalled());
      expect(actions.addMessage).toHaveBeenCalledWith({
        customIcon: <PauseIcon />,
        description: 'Your application will not reflect the most recent data until Cost Management connection is resumed',
        title: 'Cost Management connection paused',
        variant: 'default',
      });
    });
  });
});
