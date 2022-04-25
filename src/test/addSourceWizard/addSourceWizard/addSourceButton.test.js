import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddSourceButton } from '../../../components/addSourceWizard/';
import sourceTypes from '../helpers/sourceTypes';
import applicationTypes from '../helpers/applicationTypes';

import render from '../__mocks__/render';
import { CLOUD_VENDOR } from '../../../utilities/constants';

describe('AddSourceButton', () => {
  it('opens wizard and close wizard', async () => {
    render(<AddSourceButton sourceTypes={sourceTypes} applicationTypes={applicationTypes} activeCategory={CLOUD_VENDOR} />);

    await userEvent.click(screen.getByText('Add Red Hat source'));

    expect(screen.getAllByRole('dialog')).toBeTruthy();

    await userEvent.click(screen.getAllByRole('button')[0]);

    expect(() => screen.getByRole('dialog')).toThrow();
  });
});
