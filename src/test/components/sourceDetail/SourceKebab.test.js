import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import { act } from 'react-dom/test-utils';

import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourceKebab from '../../../components/SourceDetail/SourceKebab';
import mockStore from '../../__mocks__/mockStore';

describe('SourceKebab', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  const PAUSE_RESUME_INDEX = 0;
  const REMOVE_INDEX = 1;
  const RENAME_INDEX = 2;

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId }],
      },
      user: { isOrgAdmin: false, writePermissions: false },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceKebab {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Dropdown)).toHaveLength(1);

    await act(async () => {
      wrapper.find(KebabToggle).props().onToggle();
    });
    wrapper.update();

    expect(wrapper.find(DropdownItem)).toHaveLength(3);

    const tooltipText = 'To perform this action, you must be granted write permissions from your Organization Administrator.';

    expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().description).toEqual('Temporarily disable data collection');
    expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().tooltip).toEqual(tooltipText);
    expect(wrapper.find('InternalDropdownItem').at(PAUSE_RESUME_INDEX).text()).toEqual(
      'PauseTemporarily disable data collection'
    );

    expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().description).toEqual(
      'Permanently delete this source and all collected data'
    );
    expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().tooltip).toEqual(tooltipText);
    expect(wrapper.find('InternalDropdownItem').at(REMOVE_INDEX).text()).toEqual(
      'RemovePermanently delete this source and all collected data'
    );

    expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().description).toEqual(undefined);
    expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().tooltip).toEqual(tooltipText);
    expect(wrapper.find('InternalDropdownItem').at(RENAME_INDEX).text()).toEqual('Rename');
  });

  it('renders correctly with paused source', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, paused_at: 'today' }],
      },
      user: { isOrgAdmin: true, writePermissions: true },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <SourceKebab {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Dropdown)).toHaveLength(1);

    await act(async () => {
      wrapper.find(KebabToggle).props().onToggle();
    });
    wrapper.update();

    expect(wrapper.find(DropdownItem)).toHaveLength(3);

    expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().description).toEqual(
      'Unpause data collection for this source'
    );
    expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().isDisabled).toEqual(undefined);
    expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().tooltip).toEqual(undefined);
    expect(wrapper.find('InternalDropdownItem').at(PAUSE_RESUME_INDEX).text()).toEqual(
      'ResumeUnpause data collection for this source'
    );

    expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().description).toEqual(
      'Permanently delete this source and all collected data'
    );
    expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().isDisabled).toEqual(undefined);
    expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().tooltip).toEqual(undefined);
    expect(wrapper.find('InternalDropdownItem').at(REMOVE_INDEX).text()).toEqual(
      'RemovePermanently delete this source and all collected data'
    );

    expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().description).toEqual(undefined);
    expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().isDisabled).toEqual(undefined);
    expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().tooltip).toEqual(undefined);
    expect(wrapper.find('InternalDropdownItem').at(RENAME_INDEX).text()).toEqual('Rename');
  });

  describe('with permissions', () => {
    beforeEach(() => {
      store = mockStore({
        sources: {
          entities: [{ id: sourceId }],
        },
        user: { isOrgAdmin: true, writePermissions: true },
      });

      wrapper = mount(
        componentWrapperIntl(
          <Route path={routes.sourcesDetail.path} render={(...args) => <SourceKebab {...args} />} />,
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

      expect(wrapper.find(DropdownItem)).toHaveLength(3);

      expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().description).toEqual(
        'Temporarily disable data collection'
      );
      expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).at(PAUSE_RESUME_INDEX).props().tooltip).toEqual(undefined);
      expect(wrapper.find('InternalDropdownItem').at(PAUSE_RESUME_INDEX).text()).toEqual(
        'PauseTemporarily disable data collection'
      );

      expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().description).toEqual(
        'Permanently delete this source and all collected data'
      );
      expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).at(REMOVE_INDEX).props().tooltip).toEqual(undefined);
      expect(wrapper.find('InternalDropdownItem').at(REMOVE_INDEX).text()).toEqual(
        'RemovePermanently delete this source and all collected data'
      );

      expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().description).toEqual(undefined);
      expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).at(RENAME_INDEX).props().tooltip).toEqual(undefined);
      expect(wrapper.find('InternalDropdownItem').at(RENAME_INDEX).text()).toEqual('Rename');
    });

    it('remove source', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).at(REMOVE_INDEX).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRemove.path, sourceId)
      );
    });

    it('pause source', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).at(REMOVE_INDEX).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRemove.path, sourceId)
      );
    });

    it('unpause source', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).at(REMOVE_INDEX).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRemove.path, sourceId)
      );
    });

    it('rename source', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).at(RENAME_INDEX).simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRename.path, sourceId)
      );
    });
  });
});
