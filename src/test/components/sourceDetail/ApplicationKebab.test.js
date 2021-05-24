import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';
import ApplicationKebab from '../../../components/SourceDetail/ApplicationKebab';

describe('ApplicationKebab', () => {
  let wrapper;
  let store;

  let removeApp;
  let addApp;
  let app;

  let initialProps;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  beforeEach(() => {
    removeApp = jest.fn();
    addApp = jest.fn();
    app = {
      id: 'app-id',
    };

    initialProps = { removeApp, addApp, app };
  });

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { isOrgAdmin: false, writePermissions: false },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Dropdown)).toHaveLength(1);

    await act(async () => {
      wrapper.find(KebabToggle).props().onToggle();
    });
    wrapper.update();

    expect(wrapper.find(DropdownItem)).toHaveLength(2);
    expect(wrapper.find(DropdownItem).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).first().props().tooltip).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
    expect(wrapper.find('InternalDropdownItem').first().text()).toEqual(
      'PauseTemporarily stop this application from collecting data.'
    );
    expect(wrapper.find(DropdownItem).first().props().description).toEqual(
      'Temporarily stop this application from collecting data.'
    );

    expect(wrapper.find(DropdownItem).last().props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).last().props().tooltip).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
    expect(wrapper.find('InternalDropdownItem').last().text()).toEqual(
      'RemovePermanently stop data collection for this application.'
    );
    expect(wrapper.find(DropdownItem).last().props().description).toEqual(
      'Permanently stop data collection for this application.'
    );
  });

  it('renders with no permissions and paused', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { isOrgAdmin: false, writePermissions: false },
    });

    app = {
      ...app,
      paused_at: 'today',
    };

    initialProps = { ...initialProps, app };

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Dropdown)).toHaveLength(1);

    await act(async () => {
      wrapper.find(KebabToggle).props().onToggle();
    });
    wrapper.update();

    expect(wrapper.find(DropdownItem)).toHaveLength(2);
    expect(wrapper.find(DropdownItem).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).first().props().tooltip).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
    expect(wrapper.find('InternalDropdownItem').first().text()).toEqual('ResumeResume data collection for this application.');
    expect(wrapper.find(DropdownItem).first().props().description).toEqual('Resume data collection for this application.');

    expect(wrapper.find(DropdownItem).last().props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).last().props().tooltip).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
    expect(wrapper.find('InternalDropdownItem').last().text()).toEqual(
      'RemovePermanently stop data collection for this application.'
    );
    expect(wrapper.find(DropdownItem).last().props().description).toEqual(
      'Permanently stop data collection for this application.'
    );
  });

  describe('with permissions and unpaused', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [{ id: sourceId }],
        },
        user: { isOrgAdmin: true, writePermissions: true },
      });

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
          store,
          initialEntry
        )
      );
    });

    it('renders correctly', async () => {
      expect(wrapper.find(Dropdown)).toHaveLength(1);

      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      expect(wrapper.find(DropdownItem)).toHaveLength(2);
      expect(wrapper.find(DropdownItem).first().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).first().props().tooltip).toEqual(undefined);
      expect(wrapper.find(DropdownItem).first().props().description).toEqual(
        'Temporarily stop this application from collecting data.'
      );
      expect(wrapper.find('InternalDropdownItem').first().text()).toEqual(
        'PauseTemporarily stop this application from collecting data.'
      );

      expect(wrapper.find(DropdownItem).last().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).last().props().tooltip).toEqual(undefined);
      expect(wrapper.find(DropdownItem).last().props().description).toEqual(
        'Permanently stop data collection for this application.'
      );
      expect(wrapper.find('InternalDropdownItem').last().text()).toEqual(
        'RemovePermanently stop data collection for this application.'
      );
    });

    it('remove application', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).last().simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', app.id)
      );
    });

    it('pause application', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).first().simulate('click');
      });
      wrapper.update();

      expect(removeApp).toHaveBeenCalled();
    });
  });

  describe('with permissions and paused', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [{ id: sourceId }],
        },
        user: { isOrgAdmin: true, writePermissions: true },
      });

      app = {
        ...app,
        paused_at: 'today',
      };

      initialProps = { ...initialProps, app };

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationKebab {...args} {...initialProps} />} />,
          store,
          initialEntry
        )
      );
    });

    it('renders correctly', async () => {
      expect(wrapper.find(Dropdown)).toHaveLength(1);

      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      expect(wrapper.find(DropdownItem)).toHaveLength(2);
      expect(wrapper.find(DropdownItem).first().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).first().props().tooltip).toEqual(undefined);
      expect(wrapper.find('InternalDropdownItem').first().text()).toEqual('ResumeResume data collection for this application.');
      expect(wrapper.find(DropdownItem).first().props().description).toEqual('Resume data collection for this application.');

      expect(wrapper.find(DropdownItem).last().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).last().props().tooltip).toEqual(undefined);
      expect(wrapper.find(DropdownItem).last().props().description).toEqual(
        'Permanently stop data collection for this application.'
      );
      expect(wrapper.find('InternalDropdownItem').last().text()).toEqual(
        'RemovePermanently stop data collection for this application.'
      );
    });

    it('remove application', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).last().simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRemoveApp.path, sourceId).replace(':app_id', app.id)
      );
    });

    it('resume application', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).first().simulate('click');
      });
      wrapper.update();

      expect(addApp).toHaveBeenCalled();
    });
  });
});
