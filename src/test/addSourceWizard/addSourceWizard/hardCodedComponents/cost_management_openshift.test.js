import React from 'react';
import { screen } from '@testing-library/react';

import render from '../../__mocks__/render';

import * as OpCm from '../../../../components/addSourceWizard/hardcodedComponents/openshift/costManagement';

describe('Cost Management OpenShift steps components', () => {
  test('Configure Cost Management Operator description', () => {
    render(<OpCm.ConfigureCostOperator />);

    expect(
      screen.getByText('For Red Hat OpenShift Container Platform 4.6 and later, install the', { exact: false }),
    ).toBeInTheDocument();
    expect(screen.getByText('costmanagement-metrics-operator')).toBeInTheDocument();
    expect(
      screen.getByText('If you configured the operator to create a source (create_source: true),', { exact: false }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Otherwise, enter the cluster identifier below. You can find the cluster identifier in the cluster’s Help > About screen.',
      ),
    ).toBeInTheDocument();
  });
});
