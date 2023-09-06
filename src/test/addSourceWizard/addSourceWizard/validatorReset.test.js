import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import TextField from '@data-driven-forms/pf4-component-mapper/text-field';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import ValidatorReset from '../../../components/addSourceWizard/ValidatorReset';

describe('validatorReset', () => {
  it('sets value on timeout after mount and remove value after unmnout', async () => {
    const user = userEvent.setup();

    const onSubmit = jest.fn();

    render(
      <FormRenderer
        componentMapper={{
          reset: ValidatorReset,
          [componentTypes.TEXT_FIELD]: TextField,
        }}
        schema={{
          fields: [
            {
              name: 'show',
              component: componentTypes.TEXT_FIELD,
            },
            {
              name: 'reset',
              component: 'reset',
              condition: {
                when: 'show',
                is: 'true',
              },
            },
          ],
        }}
        onSubmit={(values) => onSubmit(values)}
        FormTemplate={FormTemplate}
      />
    );

    await waitFor(async () => {
      await user.type(screen.getByRole('textbox'), 'true');
    });
    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith({ show: 'true', reset: '1' });
    onSubmit.mockClear();

    await waitFor(async () => {
      await user.clear(screen.getByRole('textbox'));
    });
    await waitFor(async () => {
      await user.type(screen.getByRole('textbox'), 'false');
    });

    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith({ show: 'false', reset: '' });
  });
});
