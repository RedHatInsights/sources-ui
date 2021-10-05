import React from 'react';
import mount from '../../__mocks__/mount';

import { Text, TextContent, ClipboardCopy } from '@patternfly/react-core';

import * as SubAzure from '../../../../components/addSourceWizard/hardcodedComponents/azure/subscriptionWatch';

describe('Azure-Subwatch hardcoded schemas', () => {
  it('ObtainIDs is rendered correctly', () => {
    const wrapper = mount(<SubAzure.ObtainIDS />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(1);
    expect(wrapper.find(ClipboardCopy)).toHaveLength(1);
  });

  it('IamResources is rendered correctly', () => {
    const wrapper = mount(<SubAzure.IamResources />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(1);
    expect(wrapper.find(ClipboardCopy)).toHaveLength(3);
  });
});
