import React from 'react';
import { MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import { Dropdown, DropdownItem, KebabToggle } from '@patternfly/react-core';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import SourceKebab from '../../../components/SourceDetail/SourceKebab';
import { InternalDropdownItem } from '@patternfly/react-core/dist/js/components/Dropdown/InternalDropdownItem';

describe('SourceKebab', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    store = configureStore()({
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

    expect(wrapper.find(DropdownItem)).toHaveLength(2);
    expect(wrapper.find(DropdownItem).first().props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).first().props().tooltip).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
    expect(wrapper.find(InternalDropdownItem).first().text()).toEqual('Rename');
    expect(wrapper.find(DropdownItem).last().props().isDisabled).toEqual(true);
    expect(wrapper.find(DropdownItem).last().props().tooltip).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
    expect(wrapper.find(InternalDropdownItem).last().text()).toEqual('Remove');
  });

  describe('with permissions', () => {
    beforeEach(() => {
      store = configureStore()({
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

      expect(wrapper.find(DropdownItem)).toHaveLength(2);
      expect(wrapper.find(DropdownItem).first().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).first().props().tooltip).toEqual(undefined);
      expect(wrapper.find(InternalDropdownItem).first().text()).toEqual('Rename');
      expect(wrapper.find(DropdownItem).last().props().isDisabled).toEqual(undefined);
      expect(wrapper.find(DropdownItem).last().props().tooltip).toEqual(undefined);
      expect(wrapper.find(InternalDropdownItem).last().text()).toEqual('Remove');
    });

    it('remove source', async () => {
      await act(async () => {
        wrapper.find(KebabToggle).props().onToggle();
      });
      wrapper.update();

      await act(async () => {
        wrapper.find(DropdownItem).last().simulate('click');
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
        wrapper.find(DropdownItem).first().simulate('click');
      });
      wrapper.update();

      expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(
        replaceRouteId(routes.sourcesDetailRename.path, sourceId)
      );
    });
  });
});
