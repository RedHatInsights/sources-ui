import React from 'react';
import { EmptyState, EmptyStateBody, EmptyStateIcon, Title } from '@patternfly/react-core';

import { componentWrapperIntl } from '../../../utilities/testsHelpers';
import NoApplications from '../../../components/SourceDetail/NoApplications';
import PlusCircleIcon from '@patternfly/react-icons/dist/esm/icons/plus-circle-icon';

describe('NoApplications', () => {
  let wrapper;

  it('renders correctly', async () => {
    wrapper = mount(componentWrapperIntl(<NoApplications />));

    expect(wrapper.find(EmptyState)).toHaveLength(1);
    expect(wrapper.find(EmptyStateIcon)).toHaveLength(1);
    expect(wrapper.find(Title).text()).toEqual('No connected applications');
    expect(wrapper.find(PlusCircleIcon)).toHaveLength(1);
    expect(wrapper.find(EmptyStateBody).text()).toEqual(
      'You have not connected any applications to this source. Use the switches above to add applications.'
    );
  });
});
