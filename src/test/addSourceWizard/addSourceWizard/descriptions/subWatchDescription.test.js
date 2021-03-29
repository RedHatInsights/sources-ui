/* eslint-disable react/display-name */
import React from 'react';

import { Text } from '@patternfly/react-core/dist/esm/components/Text/Text';
import { Stack } from '@patternfly/react-core/dist/esm/layouts/Stack/Stack';
import { StackItem } from '@patternfly/react-core/dist/esm/layouts/Stack/StackItem';
import { Flex } from '@patternfly/react-core/dist/esm/layouts/Flex/Flex';
import { FlexItem } from '@patternfly/react-core/dist/esm/layouts/Flex/FlexItem';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

import mount from '../../__mocks__/mount';
import SubWatchDescription from '../../../../addSourceWizard/addSourceWizard/descriptions/SubWatchDescription';
import FormRenderer from '../../../../addSourceWizard/sourceFormRenderer';

describe('SubWatchDescription', () => {
  it('Renders correctly when enabled', () => {
    const wrapper = mount(
      <FormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ application: { application_type_id: '1' } }}
      />
    );

    expect(wrapper.find(CheckCircleIcon)).toHaveLength(4);
    expect(wrapper.find(Text)).toHaveLength(8);
    expect(wrapper.find(Stack)).toHaveLength(1);
    expect(wrapper.find(StackItem)).toHaveLength(4);
    expect(wrapper.find(Flex)).toHaveLength(4);
    expect(wrapper.find(FlexItem)).toHaveLength(8);

    expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#3E8635');
  });

  it('Renders correctly when not enabled', () => {
    const wrapper = mount(
      <FormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ application: { application_type_id: '2' } }}
      />
    );

    expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#6A6E73');
  });
});
