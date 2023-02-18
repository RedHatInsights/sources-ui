import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddSourceButton } from '../../../components/addSourceWizard/';
import sourceTypes from '../../__mocks__/sourceTypes';
import applicationTypes from '../../__mocks__/applicationTypes';

import { CLOUD_VENDOR } from '../../../utilities/constants';

describe('AddSourceButton', () => {
  it('opens wizard and close wizard', async () => {
    const user = userEvent.setup();

    render(<AddSourceButton sourceTypes={sourceTypes} applicationTypes={applicationTypes} activeCategory={CLOUD_VENDOR} />);

    await user.click(screen.getByText('Add Red Hat source'));

    expect(screen.getAllByRole('dialog')).toBeTruthy();

    await user.click(screen.getAllByRole('button')[0]);

    expect(() => screen.getByRole('dialog')).toThrow();
  });
});
