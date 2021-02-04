import React from 'react';

import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';
import { EmptyState } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyStateBody';
import { Bullseye } from '@patternfly/react-core/dist/esm/layouts/Bullseye/Bullseye';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import EmptyStateTable from '../../../components/SourcesTable/EmptyStateTable';
import * as actions from '../../../redux/sources/actions';

describe('EmptyStateTable', () => {
  it('render correctly', () => {
    const wrapper = mount(componentWrapperIntl(<EmptyStateTable />));

    expect(wrapper.find(Bullseye)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(1);
    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateBody)).toHaveLength(1);
  });

  it('calls clear filters when click on button', () => {
    actions.clearFilters = jest.fn().mockImplementation(() => ({ type: 'cosi' }));

    const wrapper = mount(componentWrapperIntl(<EmptyStateTable />));

    wrapper.find(Button).simulate('click');

    expect(actions.clearFilters).toHaveBeenCalled();
  });
});
