/* eslint-disable react/display-name */
import React from 'react';

import { Text, Stack, StackItem, Flex, FlexItem } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

import mount from '../../__mocks__/mount';
import SubWatchDescription from '../../../../components/addSourceWizard/descriptions/SubWatchDescription';
import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';

describe('SubWatchDescription', () => {
  it('Renders correctly when enabled - not super key mode ', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ application: { application_type_id: '1' }, source: { app_creation_workflow: 'manual_configuration' } }}
        onSubmit={jest.fn()}
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

  it('Renders correctly with azure', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{
          application: { application_type_id: '1' },
          source: { app_creation_workflow: 'manual_configuration' },
          source_type: 'azure',
        }}
        onSubmit={jest.fn()}
      />
    );

    expect(wrapper.find(CheckCircleIcon)).toHaveLength(2);
    expect(wrapper.find(Text)).toHaveLength(4);
    expect(wrapper.find(Stack)).toHaveLength(1);
    expect(wrapper.find(StackItem)).toHaveLength(2);
    expect(wrapper.find(Flex)).toHaveLength(2);
    expect(wrapper.find(FlexItem)).toHaveLength(4);

    expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#3E8635');
  });

  it('Renders correctly when enabled - super key mode', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ applications: ['1'], source: { app_creation_workflow: 'account_authorization' } }}
        onSubmit={jest.fn()}
      />
    );
    expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#3E8635');
  });

  it('Renders correctly when not enabled - not super key mode', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ application: { application_type_id: '2' }, source: { app_creation_workflow: 'manual_configuration' } }}
        onSubmit={jest.fn()}
      />
    );

    expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#6A6E73');
  });

  it('Renders correctly when not enabled - super key mode', () => {
    const wrapper = mount(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ applications: [], source: { app_creation_workflow: 'account_authorization' } }}
        onSubmit={jest.fn()}
      />
    );

    expect(wrapper.find(CheckCircleIcon).first().props().fill).toEqual('#6A6E73');
  });
});
