/* eslint-disable react/display-name */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { defaultSourcesState } from '../../../../redux/sources/reducer';
import { MANUAL_CONFIGURATION } from '../../../../components/constants';
import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';
import HybridCommittedSpendDescription from '../../../../components/addSourceWizard/descriptions/HybridCommittedSpendDescription';
import mockStore from '../../../__mocks__/mockStore';
import sourceTypes from '../../../__mocks__/sourceTypes';
import componentWrapperIntl from '../../../../utilities/testsHelpers';

describe('HybridCommittedSpendDescription', () => {
  let initialState;

  beforeEach(() => {
    initialState = {
      sources: { ...defaultSourcesState, sourceTypes },
      user: {
        writePermissions: true,
      },
    };
  });

  it('Renders correctly when enabled - not super key mode ', () => {
    const store = mockStore(initialState);
    const { container } = render(
      componentWrapperIntl(
        <SourcesFormRenderer
          schema={{
            fields: [{ name: 'desc', component: 'description', Content: () => <HybridCommittedSpendDescription id="2" /> }],
          }}
          initialValues={{
            application: { application_type_id: '2' },
            source: { app_creation_workflow: MANUAL_CONFIGURATION },
            source_type: 'amazon',
          }}
          onSubmit={jest.fn()}
        />,
        store
      )
    );

    expect(screen.getByText('Track Red Hat committed spend')).toBeInTheDocument();
    expect(
      screen.getByText('Track spend through Amazon Web Services and apply them to your Red Hat committed spend.')
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
    const store = mockStore(initialState);
    const { container } = render(
      componentWrapperIntl(
        <SourcesFormRenderer
          schema={{
            fields: [{ name: 'desc', component: 'description', Content: () => <HybridCommittedSpendDescription id="1" /> }],
          }}
          initialValues={{
            application: { application_type_id: '2' },
            source: { app_creation_workflow: MANUAL_CONFIGURATION },
            source_type: 'amazon',
          }}
          onSubmit={jest.fn()}
        />,
        store
      )
    );

    expect(screen.getByText('Track Red Hat committed spend')).toBeInTheDocument();
    expect(
      screen.getByText('Track spend through Amazon Web Services and apply them to your Red Hat committed spend.')
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
