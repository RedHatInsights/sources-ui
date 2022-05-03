import React from 'react';
import { screen } from '@testing-library/react';

import render from '../../__mocks__/render';

import sourceTypes from '../../../__mocks__/sourceTypes';
import SuperKeyCredentials from '../../../../components/addSourceWizard/superKey/SuperKeyCredentials';
import SourcesFormRenderer from '../../../../utilities/SourcesFormRenderer';

describe('SuperKeyCredentials', () => {
  it('renders for amazon type', () => {
    render(
      <SourcesFormRenderer
        onSubmit={jest.fn()}
        schema={{
          fields: [
            {
              component: 'description',
              name: 'desc',
              Content: SuperKeyCredentials,
              sourceTypes,
            },
          ],
        }}
        initialValues={{ source_type: 'amazon' }}
      />
    );

    expect(screen.getByText('Access key ID')).toBeInTheDocument();
    expect(screen.getByText('Secret access key')).toBeInTheDocument();
  });
});
