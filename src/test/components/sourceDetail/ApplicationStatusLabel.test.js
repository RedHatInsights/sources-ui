import { Popover, Label } from '@patternfly/react-core';
import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';

import React from 'react';
import { Route } from 'react-router-dom';

import ApplicationStatusLabel from '../../../components/SourceDetail/ApplicationStatusLabel';
import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { AVAILABLE, IN_PROGRESS, UNAVAILABLE } from '../../../views/formatters';
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

  it('renders in progress', async () => {
    app = {
      application_type_id: COSTMANAGEMENT_APP.id,
      availability_status: IN_PROGRESS,
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

    expect(wrapper.find('.pf-c-label').text()).toEqual('In progress');
    const LabelJSX = wrapper.find(Label).debug();
    /* For some reason, when trying to print props,
    it got stuck because of "circular structure to json" issue.
    It's caused by react node as a prop.*/
    expect(LabelJSX.match(/<Label.*>/)[0].includes('color="grey"'));
    expect(wrapper.find(WrenchIcon)).toHaveLength(1);

    const PopoverJSX = wrapper.find(Popover).debug();
    expect(
      PopoverJSX.match(/<Popover.*>/)[0].includes(
        'bodyContent="We are still working to validate credentials. Check back for status updates."'
      )
    );
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
