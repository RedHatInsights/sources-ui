import React from 'react';
import { Route } from 'react-router-dom';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import ApplicationsCard from '../../../components/SourceDetail/ApplicationsCard';
import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import applicationTypesData, { COSTMANAGEMENT_APP, SUBWATCH_APP } from '../../__mocks__/applicationTypesData';
import mockStore from '../../__mocks__/mockStore';

import * as api from '../../../api/entities';
import * as actions from '../../../redux/sources/actions';

describe('ApplicationsCard', () => {
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  const updateAppData = [...applicationTypesData.data, SUBWATCH_APP];

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, source_type_id: AMAZON_ID, applications: [] }],
        sourceTypes: sourceTypesData.data,
        appTypes: updateAppData,
      },
      user: { writePermissions: false },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('Applications')).toBeInTheDocument();
    expect(screen.getAllByRole('checkbox')).toHaveLength(2);

    expect(screen.getAllByText('Cost Management')).toBeTruthy();
    expect(screen.getAllByRole('checkbox')[0]).toBeDisabled();

    expect(screen.getAllByText('Subscription Watch')).toBeTruthy();
    expect(screen.getAllByRole('checkbox')[1]).toBeDisabled();

    await userEvent.hover(screen.getByText('Cost Management', { selector: '.pf-m-off' }));

    await waitFor(() =>
      expect(
        screen.getByText(
          'To perform this action, you must be granted Sources Administrator permissions from your Organization Administrator.'
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
            source_type_id: AMAZON_ID,
            applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id }],
            paused_at: 'today',
          },
        ],
        sourceTypes: sourceTypesData.data,
        appTypes: updateAppData,
      },
      user: { writePermissions: true },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
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
              source_type_id: AMAZON_ID,
              applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id }],
            },
          ],
          sourceTypes: sourceTypesData.data,
          appTypes: updateAppData,
        },
        user: { writePermissions: true },
      });

      actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'undefined' }));
    });

    it('renders correctly', () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      expect(screen.getByText('Applications')).toBeInTheDocument();

      expect(screen.getAllByText('Cost Management')).toBeTruthy();
      expect(screen.getAllByText('Subscription Watch')).toBeTruthy();

      expect(screen.getByLabelText('Actions')).toBeInTheDocument();

      expect(screen.getAllByRole('checkbox')).toHaveLength(2);
      expect(screen.getAllByRole('checkbox')[0]).not.toBeDisabled();
      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      expect(screen.getAllByRole('checkbox')[1]).not.toBeDisabled();
      expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();
    });

    it('pause application', async () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));
      const pauseApplication = mockApi('ok');

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      expect(pauseApplication).toHaveBeenCalledWith('123');
      pauseApplication.mockClear();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(pauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      await waitFor(() => expect(actions.loadEntities).toHaveBeenCalled());
    });

    it('add application', async () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      await userEvent.click(screen.getAllByRole('checkbox')[1]);

      expect(screen.getByTestId('location-display').textContent).toEqual(
        replaceRouteId(routes.sourcesDetailAddApp.path, sourceId).replace(':app_type_id', SUBWATCH_APP.id)
      );
    });

    it('unpause application', async () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_ID,
              applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
            },
          ],
          sourceTypes: sourceTypesData.data,
          appTypes: [COSTMANAGEMENT_APP],
        },
        user: { writePermissions: true },
      });

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

      const unpauseApplication = mockApi('ok');

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      expect(unpauseApplication).toHaveBeenCalledWith('123');
      unpauseApplication.mockClear();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(unpauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

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
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_ID,
              applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
            },
          ],
          sourceTypes: sourceTypesData.data,
          appTypes: [COSTMANAGEMENT_APP],
        },
        user: { writePermissions: true },
      });

      const unpauseApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application resume failed',
          variant: 'danger',
        })
      );
    });

    it('unpause application via dropdown', async () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_ID,
              applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
            },
          ],
          sourceTypes: sourceTypesData.data,
          appTypes: [COSTMANAGEMENT_APP],
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
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      await userEvent.click(screen.getByLabelText('Actions'));
      await userEvent.click(screen.getByText('Resume'));

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
              source_type_id: AMAZON_ID,
              applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id }],
              app_creation_workflow: 'account_authorization',
            },
          ],
          sourceTypes: sourceTypesData.data,
          appTypes: updateAppData,
        },
        user: { writePermissions: true },
      });

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));
    });

    it('unpaused application and blocks clicking again', async () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_ID,
              applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
              app_creation_workflow: 'account_authorization',
            },
          ],
          sourceTypes: sourceTypesData.data,
          appTypes: [COSTMANAGEMENT_APP],
        },
        user: { writePermissions: true },
      });

      const unpauseApplication = mockApi('ok');

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      expect(unpauseApplication).toHaveBeenCalledWith('123');
      unpauseApplication.mockClear();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(unpauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

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
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      api.doCreateApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));
      actions.addMessage.mockClear();

      await userEvent.click(screen.getAllByRole('checkbox')[1]);

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application create failed',
          variant: 'danger',
        })
      );
    });

    it('pauses application and fail', async () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      const pauseApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));

      actions.addMessage.mockClear();

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application pause failed',
          variant: 'danger',
        })
      );
    });

    it('resumes application and fail', async () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: sourceId,
              source_type_id: AMAZON_ID,
              applications: [{ id: '123', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
              app_creation_workflow: 'account_authorization',
            },
          ],
          sourceTypes: sourceTypesData.data,
          appTypes: [COSTMANAGEMENT_APP],
        },
        user: { writePermissions: true },
      });

      const unpauseApplication = jest.fn().mockImplementation(() => Promise.reject('Some backend error'));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      actions.addMessage.mockClear();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      await waitFor(() =>
        expect(actions.addMessage).toHaveBeenCalledWith({
          description: 'Some backend error. Please try again.',
          title: 'Application resume failed',
          variant: 'danger',
        })
      );
    });

    it('adds application', async () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      api.doCreateApplication = mockApi('ok');

      expect(screen.getAllByRole('checkbox')[1]).not.toBeChecked();

      await userEvent.click(screen.getAllByRole('checkbox')[1]);

      expect(screen.getAllByRole('checkbox')[1]).toBeChecked();

      expect(api.doCreateApplication).toHaveBeenCalledWith({
        application_type_id: SUBWATCH_APP.id,
        source_id: sourceId,
      });
      expect(actions.loadEntities).not.toHaveBeenCalled();

      await waitFor(() => expect(actions.loadEntities).toHaveBeenCalled());
    });

    it('pause application and blocks clicking again', async () => {
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      const pauseApplication = mockApi('ok');

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

      actions.addMessage.mockClear();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();

      expect(pauseApplication).toHaveBeenCalledWith('123');
      pauseApplication.mockClear();

      await userEvent.click(screen.getAllByRole('checkbox')[0]);

      expect(pauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

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
      render(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      const pauseApplication = jest.fn().mockImplementation(() => Promise.resolve('ok'));

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      await userEvent.click(screen.getByLabelText('Actions'));
      await userEvent.click(screen.getByText('Pause'));

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
