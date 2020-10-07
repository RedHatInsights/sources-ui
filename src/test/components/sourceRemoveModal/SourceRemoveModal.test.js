import React from 'react';
import thunk from 'redux-thunk';
import { mount } from 'enzyme';
import { notificationsMiddleware } from '@redhat-cloud-services/frontend-components-notifications';
import { Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Text, Button } from '@patternfly/react-core';
import { MemoryRouter } from 'react-router-dom';

import * as actions from '../../../redux/sources/actions';
import SourceRemoveModal from '../../../components/SourceRemoveModal/SourceRemoveModal';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { sourcesDataGraphQl } from '../../__mocks__/sourcesData';
import { applicationTypesData, CATALOG_APP } from '../../__mocks__/applicationTypesData';
import { sourceTypesData, ANSIBLE_TOWER, SATELLITE, OPENSHIFT } from '../../__mocks__/sourceTypesData';

import { routes, replaceRouteId } from '../../../Routes';
import AppListInRemoval from '../../../components/SourceRemoveModal/AppListInRemoval';

describe('SourceRemoveModal', () => {
  const middlewares = [thunk, notificationsMiddleware()];
  let mockStore;
  let store;

  beforeEach(() => {
    mockStore = configureStore(middlewares);
    store = mockStore({
      sources: {
        entities: sourcesDataGraphQl,
        appTypes: applicationTypesData.data,
        sourceTypes: sourceTypesData.data,
      },
    });
  });

  describe('source with no application', () => {
    it('renders correctly', () => {
      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '14')]
        )
      );

      expect(wrapper.find('input')).toHaveLength(1); // checkbox
      expect(wrapper.find(Button)).toHaveLength(3); // cancel modal, cancel delete, delete
      expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(true); // delete is disabled
      expect(wrapper.find(AppListInRemoval)).toHaveLength(0);
    });

    it('enables submit button', () => {
      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '14')]
        )
      );

      expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(true); // delete is disabled

      wrapper.find('input').simulate('change', { target: { checked: true } }); // click on checkbox
      wrapper.update();

      expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(false); // delete is enabled
    });

    it('calls submit action', () => {
      actions.removeSource = jest.fn().mockImplementation(() => ({ type: 'REMOVE' }));

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '14')]
        )
      );

      wrapper.find('input').simulate('change', { target: { checked: true } }); // click on checkbox
      wrapper.update();

      wrapper.find('button[id="deleteSubmit"]').simulate('click');

      const source = sourcesDataGraphQl.find((s) => s.id === '14');

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sources.path); // modal was closed
      expect(actions.removeSource).toHaveBeenCalledWith('14', `${source.name} was deleted successfully.`); // calls removeSource with id of the source and right message
    });
  });

  describe('source with applications', () => {
    it('renders correctly', () => {
      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      const source = sourcesDataGraphQl.find((s) => s.id === '406');
      const application = applicationTypesData.data.find((app) => app.id === source.applications[0].application_type_id);

      expect(wrapper.find('input')).toHaveLength(1); // checkbox
      expect(wrapper.find(Button)).toHaveLength(3); // cancel modal, cancel delete, delete
      expect(wrapper.find('button[id="deleteSubmit"]').props().disabled).toEqual(true); // delete is disabled
      expect(wrapper.find(AppListInRemoval)).toHaveLength(1);
      expect(wrapper.find(Text).at(1).text().includes(application.display_name)).toEqual(true); // application in the list
    });

    it('renders correctly when app is being deleted', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              ...sourcesDataGraphQl.find((s) => s.id === '406'),
              applications: [
                {
                  ...sourcesDataGraphQl.find((s) => s.id === '406').applications,
                  isDeleting: true,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      expect(wrapper.find(AppListInRemoval)).toHaveLength(0);
    });

    it('renders correctly - ansible tower', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: '406',
              name: 'Source pokus',
              source_type_id: ANSIBLE_TOWER.id,
              applications: [
                {
                  id: 'someid',
                  application_type_id: CATALOG_APP.id,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      expect(wrapper.find(Text).first().text().includes('data')).toEqual(false);
    });

    it('renders correctly - satellite', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: '406',
              name: 'Source pokus',
              source_type_id: SATELLITE.id,
              applications: [
                {
                  id: 'someid',
                  application_type_id: CATALOG_APP.id,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      expect(wrapper.find(Text).first().text().includes('data')).toEqual(false);
    });

    it('renders correctly - openshift', () => {
      store = mockStore({
        sources: {
          entities: [
            {
              id: '406',
              name: 'Source pokus',
              source_type_id: OPENSHIFT.id,
              applications: [
                {
                  id: 'someid',
                  application_type_id: CATALOG_APP.id,
                },
              ],
            },
          ],
          appTypes: applicationTypesData.data,
          sourceTypes: sourceTypesData.data,
        },
      });

      const wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesRemove.path} render={(...args) => <SourceRemoveModal {...args} />} />,
          store,
          [replaceRouteId(routes.sourcesRemove.path, '406')]
        )
      );

      expect(wrapper.find(Text).first().text().includes('data')).toEqual(true);
    });
  });
});
