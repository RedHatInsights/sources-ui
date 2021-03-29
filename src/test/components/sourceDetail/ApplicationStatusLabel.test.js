import { Popover, Label } from '@patternfly/react-core';

import React from 'react';
import { Route } from 'react-router-dom';

import ApplicationStatusLabel from '../../../components/SourceDetail/ApplicationStatusLabel';
import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { AVAILABLE, UNAVAILABLE } from '../../../views/formatters';
import applicationTypesData, { COSTMANAGEMENT_APP } from '../../__mocks__/applicationTypesData';
import mockStore from '../../__mocks__/mockStore';

describe('ApplicationStatusLabel', () => {
  let wrapper;
  let store;
  let app;

  const sourceId = '3627987';

  it('renders available', async () => {
    app = {
      application_type_id: COSTMANAGEMENT_APP.id,
      availability_status: AVAILABLE,
    };
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
          },
        ],
        appTypes: applicationTypesData.data,
      },
    });

    wrapper = mount(componentWrapperIntl(<ApplicationStatusLabel app={app} />, store));

    expect(wrapper.find(Label).text()).toEqual('Available');
    expect(wrapper.find(Label).props().color).toEqual('green');
    expect(wrapper.find(Popover).props().bodyContent).toEqual('Everything works fine.');
  });

  it('renders unavailable - no error set', async () => {
    app = {
      application_type_id: COSTMANAGEMENT_APP.id,
      availability_status: UNAVAILABLE,
    };
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
          },
        ],
        appTypes: applicationTypesData.data,
      },
    });

    wrapper = mount(componentWrapperIntl(<ApplicationStatusLabel app={app} />, store));

    expect(wrapper.find(Label).text()).toEqual('Unavailable');
    expect(wrapper.find(Label).props().color).toEqual('red');
    expect(wrapper.find(Popover).props().bodyContent).toEqual('Unknown error');
  });

  it('renders unavailable', async () => {
    app = {
      application_type_id: COSTMANAGEMENT_APP.id,
      availability_status: UNAVAILABLE,
      availability_status_error: 'app-error',
    };
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
          },
        ],
        appTypes: applicationTypesData.data,
      },
    });

    wrapper = mount(componentWrapperIntl(<ApplicationStatusLabel app={app} />, store));

    expect(wrapper.find(Label).text()).toEqual('Unavailable');
    expect(wrapper.find(Label).props().color).toEqual('red');
    expect(wrapper.find(Popover).props().bodyContent).toEqual('app-error');
  });

  it('renders unavailable - endpoint error', async () => {
    app = {
      application_type_id: COSTMANAGEMENT_APP.id,
      authentications: [{ resource_type: 'Endpoint' }],
    };
    store = mockStore({
      sources: {
        entities: [
          {
            id: sourceId,
            endpoints: [
              {
                availability_status: UNAVAILABLE,
                availability_status_error: 'endpoint-error',
              },
            ],
          },
        ],
        appTypes: applicationTypesData.data,
      },
    });
    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationStatusLabel {...args} app={app} />} />,
        store,
        [replaceRouteId(routes.sourcesDetail.path, sourceId)]
      )
    );

    expect(wrapper.find(Label).text()).toEqual('Unavailable');
    expect(wrapper.find(Label).props().color).toEqual('red');
    expect(wrapper.find(Popover).props().bodyContent).toEqual('endpoint-error');
  });
});
