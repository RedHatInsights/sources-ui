import React from 'react';
import render from '../../__mocks__/render';
import { screen } from '@testing-library/react';

import * as OpenShift from '../../../../components/addSourceWizard/hardcodedComponents/openshift/endpoint';

describe('Tower Catalog', () => {
  it('Endpoint description', () => {
    render(<OpenShift.EndpointDesc />);

    expect(screen.getByText('Provide the OpenShift Container Platform URL and SSL certificate.')).toBeInTheDocument();
  });
});
