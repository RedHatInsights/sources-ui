import React from 'react';
import { Link, MemoryRouter, Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import { Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import Breadcrumbs from '../../../components/SourceDetail/Breadcrumbs';

describe('Breadcrumbs', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  beforeEach(() => {
    store = configureStore()({
      sources: {
        entities: [{ id: sourceId, name: 'Somename' }],
      },
      user: { isOrgAdmin: false, writePermissions: false },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <Breadcrumbs {...args} />} />,
        store,
        initialEntry
      )
    );
  });

  it('renders correctly', async () => {
    expect(wrapper.find(Breadcrumb)).toHaveLength(1);
    expect(wrapper.find(BreadcrumbItem)).toHaveLength(2);

    expect(wrapper.find(BreadcrumbItem).first().text()).toEqual('Sources');
    expect(wrapper.find(BreadcrumbItem).last().text()).toEqual('Somename');
    expect(wrapper.find(BreadcrumbItem).last().props().isActive).toEqual(true);
  });

  it('goes back to sources', async () => {
    await act(async () => {
      wrapper.find(Link).first().simulate('click', { button: 0 });
    });
    wrapper.update();

    expect(wrapper.find(MemoryRouter).instance().history.location.pathname).toEqual(routes.sources.path);
  });
});
