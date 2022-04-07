import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import applicationTypesData, { COSTMANAGEMENT_APP, SUBWATCH_APP } from '../../__mocks__/applicationTypesData';

import { Route } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';
import ResourcesTable from '../../../components/SourceDetail/ResourcesTable';

import * as api from '../../../api/doLoadSourceForEdit';

describe('ResourcesTable', () => {
  let store;
  let source;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders empty state ', async () => {
    api.doLoadSourceForEdit = jest.fn();

    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            source_type_id: AMAZON_ID,
            applications: [],
          },
        ],
        sourceTypes: sourceTypesData.data,
        appTypes: applicationTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByText('Connected application resources')).toBeInTheDocument();
    expect(screen.getByText('No connected applications')).toBeInTheDocument();

    expect(api.doLoadSourceForEdit).not.toHaveBeenCalled();
  });

  it('renders empty state when no resources for app', async () => {
    api.doLoadSourceForEdit = api.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          id: sourceId,
          source_type_id: AMAZON_ID,
          applications: [
            {
              id: '123',
              application_type_id: COSTMANAGEMENT_APP.id,
              authentications: [],
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: COSTMANAGEMENT_APP.id,
            id: '123',
            authentications: [],
          },
        ],
        endpoints: [],
        authentications: [],
      })
    );

    source = {
      id: sourceId,
      source_type_id: AMAZON_ID,
      applications: [{ id: '12344', application_type_id: COSTMANAGEMENT_APP.id }],
    };

    store = mockStore({
      sources: {
        entities: [source],
        sourceTypes: sourceTypesData.data,
        appTypes: applicationTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Connected application resources')).toBeInTheDocument());

    expect(() => screen.getByRole('progressbar')).toThrow();

    expect(screen.getByText('No application resources')).toBeInTheDocument();
    expect(screen.getByText('Cost Management')).toBeInTheDocument();
    expect(screen.getByText('Cost Management resources will appear here when created.')).toBeInTheDocument();

    expect(api.doLoadSourceForEdit).toHaveBeenCalledWith(source, applicationTypesData.data, sourceTypesData.data);
  });

  it('renders empty state when no resources for paused app', async () => {
    api.doLoadSourceForEdit = api.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          id: sourceId,
          source_type_id: AMAZON_ID,
          applications: [
            {
              id: '123',
              application_type_id: COSTMANAGEMENT_APP.id,
              authentications: [],
              paused_at: 'today',
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: COSTMANAGEMENT_APP.id,
            id: '123',
            authentications: [],
            paused_at: 'today',
          },
        ],
        endpoints: [],
        authentications: [],
      })
    );

    source = {
      id: sourceId,
      source_type_id: AMAZON_ID,
      applications: [{ id: '12344', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
    };

    store = mockStore({
      sources: {
        entities: [source],
        sourceTypes: sourceTypesData.data,
        appTypes: applicationTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(screen.getByText('Connected application resources')).toBeInTheDocument());

    expect(screen.getByText('Cost Management is paused')).toBeInTheDocument();
    expect(
      screen.getByText('To resume data collection for this application, switch Cost Management on in the', { exact: false })
    ).toBeInTheDocument();
  });

  it('renders correctly with multiple apps', async () => {
    api.doLoadSourceForEdit = api.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          id: sourceId,
          source_type_id: AMAZON_ID,
          applications: [
            {
              application_type_id: COSTMANAGEMENT_APP.id,
              id: '20198',
              authentications: [{ id: '19896', resource_type: 'Application' }],
            },
            {
              application_type_id: SUBWATCH_APP.id,
              id: '20199',
              authentications: [{ id: '19897', resource_type: 'Application' }],
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: COSTMANAGEMENT_APP.id,
            id: '20198',
            authentications: [
              { id: '19896' },
              {
                authtype: 'arn',
                id: '19896',
                resource_id: '20198',
                resource_type: 'Application',
                source_id: '20641',
                username: 'arn:aws:1234',
                tenant: '6089719',
              },
            ],
            extra: { bucket: 'adsadsad' },
          },
          {
            application_type_id: SUBWATCH_APP.id,
            id: '20199',
            authentications: [
              { id: '19897' },
              {
                authtype: 'cloud-meter-arn',
                id: '19897',
                resource_id: '20199',
                resource_type: 'Application',
                source_id: '20641',
                username: 'arn:aws:1234',
                tenant: '6089719',
              },
            ],
            extra: {},
          },
        ],
      })
    );

    source = {
      id: sourceId,
      source_type_id: AMAZON_ID,
      applications: [
        { id: '20198', application_type_id: COSTMANAGEMENT_APP.id },
        { id: '20199', application_type_id: SUBWATCH_APP.id },
      ],
    };

    store = mockStore({
      sources: {
        entities: [source],
        sourceTypes: sourceTypesData.data,
        appTypes: [...applicationTypesData.data, SUBWATCH_APP],
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();

    await waitFor(() => expect(screen.getByText('Connected application resources')).toBeInTheDocument());

    expect(() => screen.getByRole('progressbar')).toThrow();
    expect(screen.getByText('Cost Management')).toBeInTheDocument();
    expect(screen.getByText('Subscription Watch')).toBeInTheDocument();

    expect(api.doLoadSourceForEdit).toHaveBeenCalledWith(
      source,
      [...applicationTypesData.data, SUBWATCH_APP],
      sourceTypesData.data
    );

    const getData = () => [...container.getElementsByTagName('td')].map((td) => [td.getAttribute('data-label'), td.textContent]);

    expect(getData()).toEqual([
      ['Resource type', 'S3 bucket name'],
      ['Value', 'adsadsad'],
      ['Resource type', 'ARN'],
      ['Value', 'arn:aws:1234'],
      ['Resource type', 'ARN'],
      ['Value', 'arn:aws:1234'],
    ]);

    expect(screen.getByText('Cost Management').closest('.pf-m-current')).toBeInTheDocument();
    expect(screen.getByText('Subscription Watch').closest('.pf-m-current')).toBeNull();

    await userEvent.click(screen.getByText('Subscription Watch'));

    expect(screen.getByText('Cost Management').closest('.pf-m-current')).toBeNull();
    expect(screen.getByText('Subscription Watch').closest('.pf-m-current')).toBeInTheDocument();
  });

  it('renders correctly with paused app', async () => {
    api.doLoadSourceForEdit = api.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          id: sourceId,
          source_type_id: AMAZON_ID,
          applications: [
            {
              application_type_id: COSTMANAGEMENT_APP.id,
              id: '20198',
              authentications: [{ id: '19896', resource_type: 'Application' }],
              paused_at: 'today',
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: COSTMANAGEMENT_APP.id,
            id: '20198',
            authentications: [
              { id: '19896' },
              {
                authtype: 'arn',
                id: '19896',
                resource_id: '20198',
                resource_type: 'Application',
                source_id: '20641',
                username: 'arn:aws:1234',
                tenant: '6089719',
              },
            ],
            extra: { bucket: 'adsadsad' },
            paused_at: 'today',
          },
        ],
      })
    );

    source = {
      id: sourceId,
      source_type_id: AMAZON_ID,
      applications: [{ id: '20198', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
    };

    store = mockStore({
      sources: {
        entities: [source],
        sourceTypes: sourceTypesData.data,
        appTypes: applicationTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(screen.getByText('Connected application resources')).toBeInTheDocument());

    expect(screen.getByText('Cost Management is paused')).toBeInTheDocument();
    expect(
      screen.getByText('To resume data collection for this application, switch Cost Management on in the', { exact: false })
    ).toBeInTheDocument();
  });

  it('renders correctly with paused and paused source app', async () => {
    api.doLoadSourceForEdit = api.doLoadSourceForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        source: {
          id: sourceId,
          paused_at: 'now',
          source_type_id: AMAZON_ID,
          applications: [
            {
              application_type_id: COSTMANAGEMENT_APP.id,
              id: '20198',
              authentications: [{ id: '19896', resource_type: 'Application' }],
              paused_at: 'today',
            },
          ],
          endpoints: [],
        },
        applications: [
          {
            application_type_id: COSTMANAGEMENT_APP.id,
            id: '20198',
            authentications: [
              { id: '19896' },
              {
                authtype: 'arn',
                id: '19896',
                resource_id: '20198',
                resource_type: 'Application',
                source_id: '20641',
                username: 'arn:aws:1234',
                tenant: '6089719',
              },
            ],
            extra: { bucket: 'adsadsad' },
            paused_at: 'today',
          },
        ],
      })
    );

    source = {
      id: sourceId,
      source_type_id: AMAZON_ID,
      applications: [{ id: '20198', application_type_id: COSTMANAGEMENT_APP.id, paused_at: 'today' }],
      paused_at: 'today',
    };

    store = mockStore({
      sources: {
        entities: [source],
        sourceTypes: sourceTypesData.data,
        appTypes: applicationTypesData.data,
        appTypesLoaded: true,
        sourceTypesLoaded: true,
        loaded: 0,
      },
    });

    const { container } = render(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
        store,
        initialEntry
      )
    );

    await waitFor(() => expect(screen.getByText('Connected application resources')).toBeInTheDocument());

    expect(screen.getByText('Cost Management')).toBeInTheDocument();

    const getData = () => [...container.getElementsByTagName('td')].map((td) => [td.getAttribute('data-label'), td.textContent]);

    expect(getData()).toEqual([
      ['Resource type', 'S3 bucket name'],
      ['Value', 'adsadsad'],
      ['Resource type', 'ARN'],
      ['Value', 'arn:aws:1234'],
    ]);
  });
});
