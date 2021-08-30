import React from 'react';
import { Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { Alert, AlertActionLink, Tooltip } from '@patternfly/react-core';
import PauseIcon from '@patternfly/react-icons/dist/esm/icons/pause-icon';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';
import PauseAlert from '../../../components/SourceDetail/PauseAlert';
import * as actions from '../../../redux/sources/actions';

describe('DetailHeader', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this source', paused_at: 'today' }],
      },
      user: { writePermissions: false, writePermissions: false },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <PauseAlert {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Alert).props().title).toEqual('Source paused');
    expect(wrapper.find(Alert).props().variant).toEqual('default');
    expect(wrapper.find(Alert).find(PauseIcon)).toHaveLength(1);
    expect(wrapper.find(Alert).props().children).toEqual(
      'No data is being collected for this source. Turn the source back on to reestablish connection and data collection. Previous credentials will be restored and application connections will continue as seen on this page.'
    );

    expect(wrapper.find(Tooltip).props().content).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );

    expect(wrapper.find(AlertActionLink).props().isDisabled).toEqual(true);
    expect(wrapper.find(AlertActionLink).text()).toEqual('Resume connection');
  });

  it('renders with permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this source', paused_at: 'today' }],
      },
      user: { writePermissions: true, writePermissions: true },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <PauseAlert {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Alert).props().title).toEqual('Source paused');
    expect(wrapper.find(Alert).props().variant).toEqual('default');
    expect(wrapper.find(Alert).find(PauseIcon)).toHaveLength(1);
    expect(wrapper.find(Alert).props().children).toEqual(
      'No data is being collected for this source. Turn the source back on to reestablish connection and data collection. Previous credentials will be restored and application connections will continue as seen on this page.'
    );

    expect(wrapper.find(Tooltip)).toHaveLength(0);

    expect(wrapper.find(AlertActionLink).props().isDisabled).toEqual(undefined);
    expect(wrapper.find(AlertActionLink).text()).toEqual('Resume connection');
  });

  it('resume source', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this source', paused_at: 'today' }],
      },
      user: { writePermissions: true, writePermissions: true },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <PauseAlert {...args} />} />,
        store,
        initialEntry
      )
    );

    actions.resumeSource = jest.fn().mockImplementation(() => ({ type: 'mock-resume-source' }));

    await act(async () => {
      wrapper.find('button').simulate('click');
    });
    wrapper.update();

    expect(actions.resumeSource).toHaveBeenCalledWith(sourceId, 'Name of this source', expect.any(Object));

    const calledActions = store.getActions();
    expect(calledActions[calledActions.length - 1]).toEqual({ type: 'mock-resume-source' });
  });
});
