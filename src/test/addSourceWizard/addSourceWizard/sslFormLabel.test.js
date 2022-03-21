import React from 'react';

import { screen } from '@testing-library/react';
import SSLFormLabel from '../../../components/addSourceWizard/SSLFormLabel';
import render from '../__mocks__/render';

describe('SSLFormLabel', () => {
  it('renders loading step correctly', () => {
    render(<SSLFormLabel />);

    expect(screen.getByText('SSL Certificate')).toBeInTheDocument();
  });
});
