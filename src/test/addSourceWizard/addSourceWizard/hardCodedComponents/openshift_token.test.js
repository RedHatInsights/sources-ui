import React from 'react';
import mount from '../../__mocks__/mount';
import { Text } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/esm/components/Text/TextContent';
import { TextList } from '@patternfly/react-core/dist/esm/components/Text/TextList';
import { TextListItem } from '@patternfly/react-core/dist/esm/components/Text/TextListItem';

import * as OpToken from '../../../../addSourceWizard/addSourceWizard/hardcodedComponents/openshift/token';

describe('AWS-Access key hardcoded schemas', () => {
  it('ARN DESCRIPTION is rendered correctly', () => {
    const wrapper = mount(<OpToken.DescriptionSummary />);

    expect(wrapper.find(TextContent)).toHaveLength(1);
    expect(wrapper.find(Text)).toHaveLength(2);
    expect(wrapper.find(TextList)).toHaveLength(1);
    expect(wrapper.find(TextListItem)).toHaveLength(3);
  });
});
