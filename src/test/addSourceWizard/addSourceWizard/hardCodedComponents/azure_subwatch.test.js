import React from 'react';
import mount from '../../__mocks__/mount';

import { Text, TextContent, TextList, TextListItem, ClipboardCopy } from '@patternfly/react-core';

import * as SubAzure from '../../../../components/addSourceWizard/hardcodedComponents/azure/subscriptionWatch';

describe('Azure-Subwatch hardcoded schemas', () => {
  it('OfflineToken is rendered correctly', () => {
    const wrapper = mount(<SubAzure.OfflineToken />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(2);
    expect(wrapper.find(TextList)).toHaveLength(1);
    expect(wrapper.find(TextListItem)).toHaveLength(1);
    expect(wrapper.find('a')).toHaveLength(1);
  });

  it('AnsiblePlaybook is rendered correctly', () => {
    const wrapper = mount(<SubAzure.AnsiblePlaybook />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(1);
    expect(wrapper.find(ClipboardCopy)).toHaveLength(2);
  });
});
