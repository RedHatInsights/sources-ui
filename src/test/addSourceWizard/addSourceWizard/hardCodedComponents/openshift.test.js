import React from 'react';
import mount from '../../__mocks__/mount';
import { Text } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent';

import * as OpenShift from '../../../../components/addSourceWizard/hardcodedComponents/openshift/endpoint';

describe('Tower Catalog', () => {
  it('Endpoint description', () => {
    const wrapper = mount(<OpenShift.EndpointDesc />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(1);
  });
});
