import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentTypes from '@data-driven-forms/react-form-renderer/component-types';
import TextField from '@data-driven-forms/pf4-component-mapper/text-field';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import ValidatorReset from '../../../components/addSourceWizard/ValidatorReset';

describe('validatorReset', () => {
  it('sets value on timeout after mount and remove value after unmnout', async () => {
    jest.useFakeTimers();

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

    userEvent.type(screen.getByRole('textbox'), 'true');

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ show: 'true', reset: '1' });
    onSubmit.mockClear();

    userEvent.type(screen.getByRole('textbox'), '{selectall}{backspace}false');

    await act(async () => {
      jest.advanceTimersByTime(1);
    });

    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ show: 'false', reset: '' });
    onSubmit.mockClear();

    jest.useRealTimers();
  });
});
