import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import render from '../../addSourceWizard/__mocks__/render';
import ValuePopover from '../../../components/FormComponents/ValuePopover';

describe('ValuePopover', () => {
  it('renders correctly', async () => {
    const user = userEvent.setup();

    render(<ValuePopover label="Some label" value="Some value" />);

    expect(() => screen.getByText('Some value')).toThrow();
    expect(() => screen.getByText('Some label')).toThrow();

    expect(screen.getByText('Show more')).toBeInTheDocument();

    await waitFor(async () => {
      await user.click(screen.getByText('Show more'));
    });

    await waitFor(() => expect(screen.getByText('Some value')).toBeInTheDocument());
    expect(screen.getByText('Some label')).toBeInTheDocument();
  });
});
