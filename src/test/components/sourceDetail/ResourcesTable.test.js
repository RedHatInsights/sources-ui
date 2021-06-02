import React from 'react';
import { act } from 'react-dom/test-utils';

import {
  CardBody,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  Spinner,
  Title,
  Tabs,
  TabTitleText,
  Alert,
} from '@patternfly/react-core';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';
import { Table } from '@patternfly/react-table';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import applicationTypesData, { COSTMANAGEMENT_APP, SUBWATCH_APP } from '../../__mocks__/applicationTypesData';

import { Route } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routes';
import mockStore from '../../__mocks__/mockStore';
import ResourcesTable from '../../../components/SourceDetail/ResourcesTable';
import NoApplications from '../../../components/SourceDetail/NoApplications';
import ResourcesEmptyState from '../../../components/SourceDetail/ResourcesEmptyState';

import * as api from '../../../api/doLoadSourceForEdit';

describe('ResourcesTable', () => {
  let wrapper;
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

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(CardTitle).text()).toEqual('Connected application resources');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find(NoApplications)).toHaveLength(1);
    expect(wrapper.find(Table)).toHaveLength(0);
    expect(wrapper.find(ResourcesEmptyState)).toHaveLength(0);

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

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
          store,
          initialEntry
        )
      );
    });

    expect(wrapper.find(Spinner)).toHaveLength(1);

    wrapper.update();

    expect(wrapper.find(Spinner)).toHaveLength(0);

    expect(wrapper.find(CardTitle).text()).toEqual('Connected application resources');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find(NoApplications)).toHaveLength(0);
    expect(wrapper.find(Table)).toHaveLength(0);
    expect(wrapper.find(ResourcesEmptyState)).toHaveLength(1);
    expect(wrapper.find(ResourcesEmptyState).props().applicationName).toEqual('Cost Management');

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(Title).text()).toEqual('No application resources');
    expect(wrapper.find(EmptyStateBody).text()).toEqual('Cost Management resources will appear here when created.');

    expect(wrapper.find(Tabs)).toHaveLength(1);
    expect(wrapper.find(TabTitleText)).toHaveLength(1);
    expect(wrapper.find(TabTitleText).text()).toEqual('Cost Management');

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

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(Alert).text()).toEqual(
      'Default alert:Cost Management is pausedTo resume data collection for this application, switch Cost Management on in the Applications section of this page.'
    );
    expect(wrapper.find(Alert).find(PauseIcon)).toHaveLength(1);
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

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
          store,
          initialEntry
        )
      );
    });

    expect(wrapper.find(Spinner)).toHaveLength(1);

    wrapper.update();

    expect(wrapper.find(Spinner)).toHaveLength(0);

    expect(wrapper.find(CardTitle).text()).toEqual('Connected application resources');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find(NoApplications)).toHaveLength(0);
    expect(wrapper.find(Table)).toHaveLength(2);
    expect(wrapper.find(ResourcesEmptyState)).toHaveLength(0);
    expect(wrapper.find(EmptyState)).toHaveLength(0);

    expect(wrapper.find(Tabs)).toHaveLength(1);
    expect(wrapper.find(TabTitleText)).toHaveLength(2);
    expect(wrapper.find(TabTitleText).first().text()).toEqual('Cost Management');
    expect(wrapper.find(TabTitleText).last().text()).toEqual('Subscription Watch');

    expect(api.doLoadSourceForEdit).toHaveBeenCalledWith(
      source,
      [...applicationTypesData.data, SUBWATCH_APP],
      sourceTypesData.data
    );

    const getData = () => wrapper.find('td').map((td) => [td.props()['data-label'], td.text()]);

    expect(getData()).toEqual([
      ['Resource type', 'S3 bucket name'],
      ['Value', 'adsadsad'],
      ['Resource type', 'ARN'],
      ['Value', 'arn:aws:1234'],
      ['Resource type', 'ARN'],
      ['Value', 'arn:aws:1234'],
    ]);

    expect(wrapper.find(Tabs).props().activeKey).toEqual('20198');

    await act(async () => {
      wrapper.find('.pf-c-tabs__link').last().simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(Tabs).props().activeKey).toEqual('20199');
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

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(Alert).text()).toEqual(
      'Default alert:Cost Management is pausedTo resume data collection for this application, switch Cost Management on in the Applications section of this page.'
    );
    expect(wrapper.find(Alert).find(PauseIcon)).toHaveLength(1);
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

    await act(async () => {
      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ResourcesTable {...args} />} />,
          store,
          initialEntry
        )
      );
    });
    wrapper.update();

    expect(wrapper.find(Alert)).toHaveLength(0);
  });
});
