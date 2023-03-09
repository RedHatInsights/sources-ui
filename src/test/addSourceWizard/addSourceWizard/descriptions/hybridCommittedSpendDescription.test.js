/* eslint-disable react/display-name */
import React from 'react';

import { screen } from '@testing-library/react';

import render from '../../__mocks__/render';

import { MANUAL_CONFIGURATION } from '../../../../components/constants';
import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';
import HybridCommittedSpendDescription from '../../../../components/addSourceWizard/descriptions/HybridCommittedSpendDescription';

describe('HybridCommittedSpendDescription', () => {
  it('Renders correctly when enabled - not super key mode ', () => {
    const { container } = render(
      <SourcesFormRenderer
        schema={{
          fields: [{ name: 'desc', component: 'description', Content: () => <HybridCommittedSpendDescription id="2" /> }],
        }}
        initialValues={{ application: { application_type_id: '2' }, source: { app_creation_workflow: MANUAL_CONFIGURATION } }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Track Red Hat spend regardless of point of purchase')).toBeInTheDocument();
    expect(
      screen.getByText('Unlock cloud images in Microsoft Azure and bring your own subscription instead of paying hourly.')
    ).toBeInTheDocument();
    expect(screen.getByText('Cost management')).toBeInTheDocument();
    expect(
      screen.getByText('Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.')
    ).toBeInTheDocument();
    expect(container.getElementsByTagName('svg')).toHaveLength(2);
    expect(container.getElementsByTagName('svg')[0]).toHaveAttribute('fill', '#3E8635');
    expect(container.getElementsByTagName('svg')[1]).toHaveAttribute('fill', '#3E8635');
  });

  it('Renders correctly when not enabled - not super key mode ', () => {
    const { container } = render(
      <SourcesFormRenderer
        schema={{
          fields: [{ name: 'desc', component: 'description', Content: () => <HybridCommittedSpendDescription id="1" /> }],
        }}
        initialValues={{ application: { application_type_id: '2' }, source: { app_creation_workflow: MANUAL_CONFIGURATION } }}
        onSubmit={jest.fn()}
      />
    );

    expect(screen.getByText('Track Red Hat spend regardless of point of purchase')).toBeInTheDocument();
    expect(
      screen.getByText('Unlock cloud images in Microsoft Azure and bring your own subscription instead of paying hourly.')
    ).toBeInTheDocument();
    expect(screen.getByText('Cost management')).toBeInTheDocument();
    expect(
      screen.getByText('Analyze, forecast, and optimize your Red Hat OpenShift cluster costs in hybrid cloud environments.')
    ).toBeInTheDocument();
    expect(container.getElementsByTagName('svg')).toHaveLength(2);
    expect(container.getElementsByTagName('svg')[0]).toHaveAttribute('fill', '#6A6E73');
    expect(container.getElementsByTagName('svg')[1]).toHaveAttribute('fill', '#6A6E73');
  });
});
