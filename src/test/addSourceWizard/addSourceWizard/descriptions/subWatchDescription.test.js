/* eslint-disable react/display-name */
import React from 'react';

import { screen } from '@testing-library/react';

import render from '../../__mocks__/render';

import { ACCOUNT_AUTHORIZATION, MANUAL_CONFIGURATION } from '../../../../components/constants';
import SubWatchDescription from '../../../../components/addSourceWizard/descriptions/SubWatchDescription';
import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';

describe('SubWatchDescription', () => {
  it('Renders correctly when enabled - not super key mode ', () => {
    const { container } = render(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ application: { application_type_id: '1' }, source: { app_creation_workflow: MANUAL_CONFIGURATION } }}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByText('Red Hat gold images')).toBeInTheDocument();
    expect(
      screen.getByText('Unlock cloud images in AWS and bring your own subscription instead of paying hourly.'),
    ).toBeInTheDocument();
    expect(screen.getByText('High precision subscription watch data')).toBeInTheDocument();
    expect(screen.getByText('View precise public cloud usage data in subscription watch.')).toBeInTheDocument();
    expect(screen.getByText('Autoregistration')).toBeInTheDocument();
    expect(screen.getByText('Cloud instances automatically connect to console.redhat.com when provisioned.')).toBeInTheDocument();
    expect(container.getElementsByTagName('svg')).toHaveLength(3);
    expect(container.getElementsByTagName('svg')[0]).toHaveAttribute('fill', '#3E8635');
  });

  it('Renders correctly with azure', () => {
    const { container } = render(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{
          application: { application_type_id: '1' },
          source: { app_creation_workflow: MANUAL_CONFIGURATION },
          source_type: 'azure',
        }}
        onSubmit={jest.fn()}
      />,
    );

    expect(screen.getByText('Red Hat gold images')).toBeInTheDocument();
    expect(
      screen.getByText('Unlock cloud images in Microsoft Azure and bring your own subscription instead of paying hourly.'),
    ).toBeInTheDocument();
    expect(() => screen.getByText('High precision subscription watch data')).toThrow();
    expect(() => screen.getByText('View precise public cloud usage data in subscription watch.')).toThrow();
    expect(screen.getByText('Autoregistration')).toBeInTheDocument();
    expect(screen.getByText('Cloud instances automatically connect to console.redhat.com when provisioned.')).toBeInTheDocument();
    expect(container.getElementsByTagName('svg')).toHaveLength(2);
    expect(container.getElementsByTagName('svg')[0]).toHaveAttribute('fill', '#3E8635');
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
      />,
    );

    expect(screen.getByText('Red Hat gold images')).toBeInTheDocument();
    expect(
      screen.getByText('Unlock cloud images in Google Cloud and bring your own subscription instead of paying hourly.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Autoregistration')).toBeInTheDocument();
    expect(screen.getByText('Cloud instances automatically connect to console.redhat.com when provisioned.')).toBeInTheDocument();
  });

  it('Renders correctly when enabled - super key mode', () => {
    const { container } = render(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ applications: ['1'], source: { app_creation_workflow: ACCOUNT_AUTHORIZATION } }}
        onSubmit={jest.fn()}
      />,
    );

    expect(container.getElementsByTagName('svg')[0]).toHaveAttribute('fill', '#3E8635');
  });

  it('Renders correctly when not enabled - not super key mode', () => {
    const { container } = render(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ application: { application_type_id: '2' }, source: { app_creation_workflow: MANUAL_CONFIGURATION } }}
        onSubmit={jest.fn()}
      />,
    );

    expect(container.getElementsByTagName('svg')[0]).toHaveAttribute('fill', '#6A6E73');
  });

  it('Renders correctly when not enabled - super key mode', () => {
    const { container } = render(
      <SourcesFormRenderer
        schema={{ fields: [{ name: 'desc', component: 'description', Content: () => <SubWatchDescription id="1" /> }] }}
        initialValues={{ applications: [], source: { app_creation_workflow: ACCOUNT_AUTHORIZATION } }}
        onSubmit={jest.fn()}
      />,
    );

    expect(container.getElementsByTagName('svg')[0]).toHaveAttribute('fill', '#6A6E73');
  });
});
