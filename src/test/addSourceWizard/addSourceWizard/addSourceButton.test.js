import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { AddSourceButton } from '../../../components/addSourceWizard/';
import sourceTypes from '../../__mocks__/sourceTypes';
import applicationTypes from '../../__mocks__/applicationTypes';

import render from '../__mocks__/render';
import { CLOUD_VENDOR } from '../../../utilities/constants';
import * as dependency from '../../../api/wizardHelpers';
import hcsEnrollment from '../../__mocks__/hcs';

describe('AddSourceButton', () => {
  it('opens wizard and close wizard', async () => {
    dependency.checkAccountHCS = jest.fn(() => new Promise((resolve) => resolve(hcsEnrollment)));
    const user = userEvent.setup();

    render(<AddSourceButton sourceTypes={sourceTypes} applicationTypes={applicationTypes} activeCategory={CLOUD_VENDOR} />);

    await user.click(screen.getByText('Add Red Hat source'));

    expect(screen.getAllByRole('dialog')).toBeTruthy();

    await user.click(screen.getAllByRole('button')[0]);

    expect(() => screen.getByRole('dialog')).toThrow();
  });
});
