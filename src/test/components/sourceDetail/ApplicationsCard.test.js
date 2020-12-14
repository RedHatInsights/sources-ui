import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import { Card, CardBody, CardTitle, FormGroup, Switch } from '@patternfly/react-core';

import ApplicationsCard from '../../../components/SourceDetail/ApplicationsCard';
import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import sourceTypesData, { AMAZON_ID } from '../../__mocks__/sourceTypesData';
import applicationTypesData, { COSTMANAGEMENT_APP, SUBWATCH_APP } from '../../__mocks__/applicationTypesData';
import ApplicationStatusLabel from '../../../components/SourceDetail/ApplicationStatusLabel';

describe('ApplicationsCard', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  const updateAppData = [...applicationTypesData.data, SUBWATCH_APP];

  it('renders with no permissions', async () => {
    store = configureStore()({
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
      store = configureStore()({
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
      expect(wrapper.find(ApplicationStatusLabel)).toHaveLength(1);
    });

    it('remove application', async () => {
      await act(async () => {
        wrapper
          .find('input')
          .first()
          .simulate('change', { target: { checked: false } });
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', '123')
      );
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
  });
});
