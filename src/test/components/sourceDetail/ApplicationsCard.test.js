import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { Card, CardBody, FormGroup, CardTitle, Switch, KebabToggle, DropdownItem } from '@patternfly/react-core';
import PlayIcon from '@patternfly/react-icons/dist/esm/icons/play-icon';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import ApplicationsCard from '../../../components/SourceDetail/ApplicationsCard';
import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import applicationTypesData, { COSTMANAGEMENT_APP, SUBWATCH_APP } from '../../__mocks__/applicationTypesData';
import mockStore from '../../__mocks__/mockStore';
import { ApplicationLabel } from '../../../views/formatters';

import * as api from '../../../api/entities';
import * as actions from '../../../redux/sources/actions';
import ApplicationKebab from '../../../components/SourceDetail/ApplicationKebab';

describe('ApplicationsCard', () => {
  let wrapper;
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
      user: { isOrgAdmin: false, writePermissions: false },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardTitle).text()).toEqual('Applications');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find('#no-permissions-applications').text()).toEqual(
      'To perform this adding/removing applications, you must be granted write permissions from your Organization Administrator.'
    );
    expect(wrapper.find(FormGroup)).toHaveLength(2);
    expect(wrapper.find(Switch)).toHaveLength(2);
    expect(wrapper.find(Switch).first().props().label).toEqual('Cost Management');
    expect(wrapper.find(Switch).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(Switch).last().props().label).toEqual('Subscription Watch');
    expect(wrapper.find(Switch).last().props().isDisabled).toEqual(true);
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
        user: { isOrgAdmin: true, writePermissions: true },
      });

      actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'undefined' }));

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );
    });

    it('renders correctly', () => {
      expect(wrapper.find(Card)).toHaveLength(1);
      expect(wrapper.find(CardTitle).text()).toEqual('Applications');
      expect(wrapper.find(CardBody)).toHaveLength(1);
      expect(wrapper.find('#no-permissions-applications')).toHaveLength(0);
      expect(wrapper.find(FormGroup)).toHaveLength(2);
      expect(wrapper.find(Switch)).toHaveLength(2);
      expect(wrapper.find(Switch).first().props().label).toEqual('Cost Management');
      expect(wrapper.find(Switch).first().props().isDisabled).toEqual(false);
      expect(wrapper.find(Switch).first().props().isChecked).toEqual(true);
      expect(wrapper.find(Switch).last().props().label).toEqual('Subscription Watch');
      expect(wrapper.find(Switch).last().props().isDisabled).toEqual(false);
      expect(wrapper.find(Switch).last().props().isChecked).toEqual(false);
      expect(wrapper.find(ApplicationLabel)).toHaveLength(1);
      expect(wrapper.find(ApplicationKebab)).toHaveLength(1);
    });

    it('remove application', async () => {
      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

      jest.useFakeTimers();

      const pauseApplication = jest.fn().mockImplementation(() => new Promise((res) => setTimeout(() => res('ok'), 1000)));

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      expect(wrapper.find(Switch).first().props().isChecked).toEqual(true);

      await act(async () => {
        wrapper
          .find('input')
          .first()
          .simulate('change', { target: { checked: false } });
      });
      wrapper.update();

      expect(wrapper.find(Switch).first().props().isChecked).toEqual(false);

      expect(pauseApplication).toHaveBeenCalledWith('123');
      pauseApplication.mockClear();

      await act(async () => {
        wrapper
          .find('input')
          .first()
          .simulate('change', { target: { checked: false } });
      });
      wrapper.update();

      expect(pauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('add application', async () => {
      await act(async () => {
        wrapper
          .find('input')
          .last()
          .simulate('change', { target: { checked: true } });
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
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
        user: { isOrgAdmin: true, writePermissions: true },
      });

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));

      jest.useFakeTimers();

      const unpauseApplication = jest.fn().mockImplementation(() => new Promise((res) => setTimeout(() => res('ok'), 1000)));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      expect(wrapper.find(Switch).first().props().isChecked).toEqual(false);

      await act(async () => {
        wrapper
          .find('input')
          .first()
          .simulate('change', { target: { checked: true } });
      });
      wrapper.update();

      expect(wrapper.find(Switch).first().props().isChecked).toEqual(true);

      expect(unpauseApplication).toHaveBeenCalledWith('123');
      unpauseApplication.mockClear();

      await act(async () => {
        wrapper
          .find('input')
          .first()
          .simulate('change', { target: { checked: true } });
      });
      wrapper.update();

      expect(unpauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(actions.addMessage).toHaveBeenCalledWith({
        customIcon: <PlayIcon />,
        title: 'Cost Management connection resumed',
        variant: 'default',
      });
      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('renders correctly descriptions', () => {
      expect(wrapper.find('.ins-c-sources__switch-description')).toHaveLength(2);
      expect(wrapper.find('.ins-c-sources__switch-description').first().text()).toEqual(
        'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.'
      );
      expect(wrapper.find('.ins-c-sources__switch-description').last().text()).toEqual(
        'Includes access to Red Hat gold images, high precision subscription watch data, and autoregistration.'
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
        user: { isOrgAdmin: true, writePermissions: true },
      });

      actions.loadEntities = jest.fn().mockImplementation(() => ({ type: 'nonsense' }));
      const unpauseApplication = jest.fn().mockImplementation(() => Promise.resolve('ok'));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).first().simulate('click');
      });
      wrapper.update();

      expect(unpauseApplication).toHaveBeenCalledWith('123');
      expect(actions.addMessage).toHaveBeenCalledWith({
        customIcon: <PlayIcon />,
        title: 'Cost Management connection resumed',
        variant: 'default',
      });
      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('renders correctly descriptions', () => {
      expect(wrapper.find('.ins-c-sources__switch-description')).toHaveLength(2);
      expect(wrapper.find('.ins-c-sources__switch-description').first().text()).toEqual(
        'Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.'
      );
      expect(wrapper.find('.ins-c-sources__switch-description').last().text()).toEqual(
        'Includes access to Red Hat gold images, high precision subscription watch data, and autoregistration.'
      );
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
        user: { isOrgAdmin: true, writePermissions: true },
      });

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

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
        user: { isOrgAdmin: true, writePermissions: true },
      });

      jest.useFakeTimers();

      const unpauseApplication = jest.fn().mockImplementation(() => new Promise((res) => setTimeout(() => res('ok'), 1000)));

      api.getSourcesApi = () => ({
        unpauseApplication,
      });

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationsCard {...args} />} />,
          store,
          initialEntry
        )
      );

      expect(wrapper.find(Switch).last().props().isChecked).toEqual(false);

      await act(async () => {
        wrapper
          .find('input')
          .last()
          .simulate('change', { target: { checked: true } });
      });
      wrapper.update();

      expect(wrapper.find(Switch).last().props().isChecked).toEqual(true);

      expect(unpauseApplication).toHaveBeenCalledWith('123');
      unpauseApplication.mockClear();

      await act(async () => {
        wrapper
          .find('input')
          .last()
          .simulate('change', { target: { checked: true } });
      });
      wrapper.update();

      expect(unpauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('adds application and blocks clicking again', async () => {
      jest.useFakeTimers();

      api.doCreateApplication = jest.fn().mockImplementation(() => new Promise((res) => setTimeout(() => res('ok'), 1000)));

      expect(wrapper.find(Switch).last().props().isChecked).toEqual(false);

      await act(async () => {
        wrapper
          .find('input')
          .last()
          .simulate('change', { target: { checked: true } });
      });
      wrapper.update();

      expect(wrapper.find(Switch).last().props().isChecked).toEqual(true);

      expect(api.doCreateApplication).toHaveBeenCalledWith({
        application_type_id: SUBWATCH_APP.id,
        source_id: sourceId,
      });
      api.doCreateApplication.mockClear();

      await act(async () => {
        wrapper
          .find('input')
          .last()
          .simulate('change', { target: { checked: true } });
      });
      wrapper.update();

      expect(api.doCreateApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('pause application and blocks clicking again', async () => {
      jest.useFakeTimers();

      const pauseApplication = jest.fn().mockImplementation(() => new Promise((res) => setTimeout(() => res('ok'), 1000)));

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      expect(wrapper.find(Switch).first().props().isChecked).toEqual(true);

      actions.addMessage.mockClear();

      await act(async () => {
        wrapper
          .find('input')
          .first()
          .simulate('change', { target: { checked: false } });
      });
      wrapper.update();

      expect(wrapper.find(Switch).first().props().isChecked).toEqual(false);

      expect(pauseApplication).toHaveBeenCalledWith('123');
      pauseApplication.mockClear();

      await act(async () => {
        wrapper
          .find('input')
          .first()
          .simulate('change', { target: { checked: false } });
      });
      wrapper.update();

      expect(pauseApplication).not.toHaveBeenCalled();
      expect(actions.loadEntities).not.toHaveBeenCalled();

      await act(async () => {
        jest.runAllTimers();
      });
      wrapper.update();

      expect(actions.addMessage).toHaveBeenCalledWith({
        customIcon: <PauseIcon />,
        description: 'Your application will not reflect the most recent data until Cost Management connection is resumed',
        title: 'Cost Management connection paused',
        variant: 'default',
      });
      expect(actions.loadEntities).toHaveBeenCalled();
    });

    it('pause application via dropdown', async () => {
      const pauseApplication = jest.fn().mockImplementation(() => Promise.resolve('ok'));

      api.getSourcesApi = () => ({
        pauseApplication,
      });

      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).first().simulate('click');
      });
      wrapper.update();

      expect(pauseApplication).toHaveBeenCalled();
      expect(actions.loadEntities).toHaveBeenCalled();
      expect(actions.addMessage).toHaveBeenCalledWith({
        customIcon: <PauseIcon />,
        description: 'Your application will not reflect the most recent data until Cost Management connection is resumed',
        title: 'Cost Management connection paused',
        variant: 'default',
      });
    });
  });
});
