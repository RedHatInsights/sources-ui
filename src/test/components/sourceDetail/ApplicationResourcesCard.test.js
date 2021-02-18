import { Card } from '@patternfly/react-core/dist/esm/components/Card/Card';
import { CardBody } from '@patternfly/react-core/dist/esm/components/Card/CardBody';
import { CardTitle } from '@patternfly/react-core/dist/esm/components/Card/CardTitle';

import React from 'react';
import { Route } from 'react-router-dom';

import ApplicationResourcesCard from '../../../components/SourceDetail/ApplicationResourcesCard';
import NoApplications from '../../../components/SourceDetail/NoApplications';
import NoPermissions from '../../../components/SourceDetail/NoPermissions';
import * as SourceEditModal from '../../../components/SourceEditForm/SourceEditModal';
import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import mockStore from '../../__mocks__/mockStore';

describe('ApplicationResourcesCard', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, applications: [] }],
      },
      user: { isOrgAdmin: false, writePermissions: false },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationResourcesCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardTitle).text()).toEqual('Manage connected applications');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find(NoPermissions)).toHaveLength(1);
    expect(wrapper.find(NoApplications)).toHaveLength(0);
    expect(wrapper.find(SourceEditModal.default)).toHaveLength(0);
  });

  it('renders with no applications', async () => {
    store = mockStore({
      sources: {
        entities: [{ id: sourceId, applications: [] }],
      },
      user: { isOrgAdmin: true, writePermissions: true },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationResourcesCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardTitle).text()).toEqual('Manage connected applications');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find(NoPermissions)).toHaveLength(0);
    expect(wrapper.find(NoApplications)).toHaveLength(1);
    expect(wrapper.find(SourceEditModal.default)).toHaveLength(0);
  });

  it('renders with applications', async () => {
    SourceEditModal.default = () => <span>Mock component</span>;

    store = mockStore({
      sources: {
        entities: [{ id: sourceId, applications: [{ id: 123 }] }],
      },
      user: { isOrgAdmin: true, writePermissions: true },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <ApplicationResourcesCard {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(Card)).toHaveLength(1);
    expect(wrapper.find(CardTitle).text()).toEqual('Manage connected applications');
    expect(wrapper.find(CardBody)).toHaveLength(1);
    expect(wrapper.find(NoPermissions)).toHaveLength(0);
    expect(wrapper.find(NoApplications)).toHaveLength(0);
    expect(wrapper.find(SourceEditModal.default)).toHaveLength(1);
  });
});
