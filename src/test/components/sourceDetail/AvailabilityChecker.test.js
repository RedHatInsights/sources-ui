import React from 'react';
import { act } from 'react-dom/test-utils';
import configureStore from 'redux-mock-store';
import { Button, Spinner } from '@patternfly/react-core';
import RedoIcon from '@patternfly/react-icons/dist/js/icons/redo-icon';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import { Route } from 'react-router-dom';
import { replaceRouteId, routes } from '../../../Routes';
import AvailabilityChecker from '../../../components/SourceDetail/AvailabilityChecker';
import * as api from '../../../api/checkSourceStatus';
import * as actions from '../../../redux/sources/actions';

describe('AvailabilityChecker', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  beforeEach(() => {
    store = configureStore()({ sources: { entities: [{ id: sourceId }] } });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <AvailabilityChecker {...args} />} />,
        store,
        initialEntry
      )
    );
  });

  it('renders correctly', () => {
    expect(wrapper.find(Button).props().isDisabled).toEqual(false);
    expect(wrapper.find(RedoIcon)).toHaveLength(1);
    expect(wrapper.find(Spinner)).toHaveLength(0);
  });

  it('checks status (click > loading > message)', async () => {
    jest.useFakeTimers();

    api.default = jest.fn().mockImplementation(() => new Promise((res) => setTimeout(() => res(), 100)));
    actions.addMessage = jest.fn().mockImplementation(() => ({ type: 'something' }));

    await act(async () => {
      wrapper.find('button').simulate('click');
    });
    wrapper.update();

    expect(api.default).toHaveBeenCalledWith(sourceId);

    expect(wrapper.find(Button).props().isDisabled).toEqual(true);
    expect(wrapper.find(RedoIcon)).toHaveLength(0);
    expect(wrapper.find(Spinner)).toHaveLength(1);

    await act(async () => {
      jest.runAllTimers();
    });
    wrapper.update();

    expect(wrapper.find(Button).props().isDisabled).toEqual(false);
    expect(wrapper.find(RedoIcon)).toHaveLength(1);
    expect(wrapper.find(Spinner)).toHaveLength(0);

    expect(actions.addMessage).toHaveBeenCalledWith(
      'Request to check source status was sent',
      'info',
      'Check this page later for updates'
    );
  });
});
