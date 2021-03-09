import React from 'react';

import { Text } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent';
import { Popover } from '@patternfly/react-core/dist/esm/components/Popover/Popover';

import * as AwsAccess from '../../../../components/addSourceWizard/hardcodedComponents/aws/access_key';
import mount from '../../__mocks__/mount';

describe('AWS-Access key hardcoded schemas', () => {
  it('ARN DESCRIPTION is rendered correctly', () => {
    const wrapper = mount(<AwsAccess.DescriptionSummary />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(2);
    expect(wrapper.find(Popover)).toHaveLength(1);
  });
});
