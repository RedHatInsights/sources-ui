import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import NoPermissions from '../../../components/SourceDetail/NoPermissions';
import PrivateIcon from '@patternfly/react-icons/dist/js/icons/private-icon';

describe('NoPermissions', () => {
  let wrapper;

  it('renders correctly', async () => {
    wrapper = mount(componentWrapperIntl(<NoPermissions />));

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(Title).text()).toEqual('Missing permissions');
    expect(wrapper.find(PrivateIcon)).toHaveLength(1);
    expect(wrapper.find(EmptyStateBody).text()).toEqual(
      'To perform this action, you must be granted write permissions from your Organization Administrator.'
    );
  });
});
