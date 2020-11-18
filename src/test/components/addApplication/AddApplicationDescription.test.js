import React from 'react';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import AddApplicationDescription from '../../../components/AddApplication/AddApplicationDescription';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourceTypesData } from '../../__mocks__/sourceTypesData';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';
import { applicationTypesData } from '../../__mocks__/applicationTypesData';

import { routes, replaceRouteId } from '../../../Routes';

describe('AddApplicationDescription', () => {
  let store;
  let initialEntry;
  const middlewares = [thunk, notificationsMiddleware()];
  let mockStore;
  let initialProps;

  beforeEach(() => {
    initialProps = {
      container: document.createElement('div'),
    };
    initialEntry = [replaceRouteId(routes.sourceManageApps.path, '23')];
    mockStore = configureStore(middlewares);
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
      },
    });
  });

  it('renders correctly', () => {
    const wrapper = mount(
      componentWrapperIntl(
        <Route
          path={routes.sourceManageApps.path}
          render={(...args) => <AddApplicationDescription {...initialProps} {...args} />}
        />,
        store,
        initialEntry
      )
    );

    const source = sourcesDataGraphQl.find((x) => x.id === '23');
    const sourceType = sourceTypesData.data.find((x) => x.id === source.source_type_id);

    expect(wrapper.find('p#add-application-desc-type').text()).toEqual(sourceType.product_name);
    expect(wrapper.find('h4#add-application-header').text()).toEqual('Add an application');
    expect(wrapper.find('p#add-application-description').text()).toEqual(
      'There are currently no applications connected to this source. Select from available applications below.'
    );
    expect(initialProps.container.hidden).toEqual(false);
  });

  it('renders correctly with application', () => {
    const wrapper = mount(
      componentWrapperIntl(
        <Route
          path={routes.sourceManageApps.path}
          render={(...args) => <AddApplicationDescription {...initialProps} {...args} />}
        />,
        store,
        [replaceRouteId(routes.sourceManageApps.path, '406')]
      )
    );

    expect(wrapper.find('h4#add-application-header').text()).toEqual('Applications');
    expect(wrapper.find('p#add-application-description').text()).toEqual(
      'Select a radio button to add an application. Click trash icon to remove an application.'
    );
  });

  it('renders correctly when SourceType does not exist', () => {
    const NOT_FOUND_MSG = 'Type not found';
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
        appTypes: applicationTypesData.data,
        sourceTypes: [],
      },
    });

    const wrapper = mount(
      componentWrapperIntl(
        <Route
          path={routes.sourceManageApps.path}
          render={(...args) => <AddApplicationDescription {...initialProps} {...args} />}
        />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find('p#add-application-desc-type').text()).toEqual(NOT_FOUND_MSG);
  });
});
