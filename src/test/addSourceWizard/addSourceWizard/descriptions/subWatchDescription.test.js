/* eslint-disable react/display-name */
import React from 'react';

import { screen } from '@testing-library/react';

import { Text, Stack, StackItem, Flex, FlexItem } from '@patternfly/react-core';
import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';

import mount from '../../__mocks__/mount';
import render from '../../__mocks__/render';

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

    expect(wrapper.find(CheckCircleIcon)).toHaveLength(3);
    expect(wrapper.find(Text)).toHaveLength(6);
    expect(wrapper.find(Stack)).toHaveLength(1);
    expect(wrapper.find(StackItem)).toHaveLength(3);
    expect(wrapper.find(Flex)).toHaveLength(3);
    expect(wrapper.find(FlexItem)).toHaveLength(6);

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

  it('Renders correctly with google', () => {
    render(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{
          application: { application_type_id: '1' },
          source: { app_creation_workflow: 'manual_configuration' },
          source_type: 'google',
        }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Red Hat gold images')).toBeInTheDocument();
    expect(
      screen.getByText('Unlock cloud images in Google Cloud and bring your own subscription instead of paying hourly.')
    ).toBeInTheDocument();
    expect(screen.getByText('Autoregistration')).toBeInTheDocument();
    expect(screen.getByText('Cloud instances automatically connect to console.redhat.com when provisioned.')).toBeInTheDocument();
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
