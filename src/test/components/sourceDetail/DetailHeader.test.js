import React from 'react';
import { Route } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import { Text, Title } from '@patternfly/react-core';

import { replaceRouteId, routes } from '../../../Routes';
import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import applicationTypesData from '../../__mocks__/applicationTypesData';
import DetailHeader from '../../../components/SourceDetail/DetailHeader';
import Breadcrumbs from '../../../components/SourceDetail/Breadcrumbs';
import { PageHeader } from '@redhat-cloud-services/frontend-components/components/cjs/PageHeader';
import SourceKebab from '../../../components/SourceDetail/SourceKebab';
import * as formatters from '../../../views/formatters';

describe('DetailHeader', () => {
  let wrapper;
  let store;

  const sourceId = '3627987';
  const initialEntry = [replaceRouteId(routes.sourcesDetail.path, sourceId)];

  it('renders with no permissions', async () => {
    formatters.availabilityFormatter = jest.fn();

    store = configureStore()({
      sources: {
        entities: [{ id: sourceId, name: 'Name of this source' }],
        appTypes: applicationTypesData.data,
      },
      user: { isOrgAdmin: false, writePermissions: false },
    });

    wrapper = mount(
      componentWrapperIntl(
        <Route path={routes.sourcesDetail.path} render={(...args) => <DetailHeader {...args} />} />,
        store,
        initialEntry
      )
    );

    expect(wrapper.find(PageHeader)).toHaveLength(1);
    expect(wrapper.find(Breadcrumbs)).toHaveLength(1);
    expect(wrapper.find(Title).text()).toEqual('Name of this source');
    expect(wrapper.find(SourceKebab)).toHaveLength(1);
    expect(wrapper.find(Text).text()).toEqual('View details and manage connections for this source.');
    expect(formatters.availabilityFormatter).toHaveBeenCalledWith(
      undefined,
      { id: sourceId, name: 'Name of this source' },
      { appTypes: applicationTypesData.data }
    );
  });
});
