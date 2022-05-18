import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { componentTypes } from '@data-driven-forms/react-form-renderer';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import EnhancedRadio from '../../../components/FormComponents/EnhancedRadio';
import { NO_APPLICATION_VALUE } from '../../../components/addSourceWizard/stringConstants';

describe('EnhancedRadio', () => {
  let onSubmit;
  let initialProps;

  beforeEach(() => {
    onSubmit = jest.fn();

    initialProps = {
      subscription: { values: true },
      onSubmit: (values) => onSubmit(values),
      FormTemplate,
      componentMapper: {
        ...componentMapper,
        'enhanced-radio': EnhancedRadio,
      },
    };
  });

  it('change options according to mutator', async () => {
    const user = userEvent.setup();

    const mutator = (option, formOptions) => {
      if (!option.value) {
        return;
      }

      const multiplier = formOptions.getState().values.multiplier || 1;

      return {
        ...option,
        value: option.value * multiplier,
      };
    };

    render(
      <FormRenderer
        {...initialProps}
        schema={{
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'multiplier',
              'aria-label': 'multiplier',
            },
            {
              component: 'enhanced-radio',
              options: [{ label: 'option1', value: 1 }, { label: 'option2', value: 2 }, { label: 'novalue' }],
              mutator,
              name: 'radio',
            },
          ],
        }}
      />
    );

    expect(screen.getAllByRole('radio').map((r) => [r.id, r.value])).toEqual([
      ['radio-1', '1'],
      ['radio-2', '2'],
    ]);

    expect(screen.getByText('option1')).toBeInTheDocument();
    expect(screen.getByText('option2')).toBeInTheDocument();

    await user.type(screen.getByLabelText('multiplier'), '2');

    expect(screen.getAllByRole('radio').map((r) => [r.id, r.value])).toEqual([
      ['radio-2', '2'],
      ['radio-4', '4'],
    ]);
  });

  it('select first when source_type and the length is one', async () => {
    const user = userEvent.setup();

    const mutator = (option) => option;

    render(
      <FormRenderer
        {...initialProps}
        schema={{
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'source_type',
              'aria-label': 'source_type',
            },
            {
              component: 'enhanced-radio',
              options: [{ label: 'option', value: 'first-option' }],
              mutator,
              name: 'radio',
            },
          ],
        }}
      />
    );

    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      radio: NO_APPLICATION_VALUE,
    });
    onSubmit.mockReset();

    await user.type(screen.getByLabelText('source_type'), 'some-value');

    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      radio: 'first-option',
      source_type: 'some-value',
    });
    onSubmit.mockReset();
  });

  it('select first app type when source type does not support the current selection', async () => {
    const user = userEvent.setup();

    const mutator = (option, formOptions) => {
      if (formOptions.getState().values.source_type === 'aws') {
        if (option.value === 'second-option') {
          return;
        }

        return option;
      }

      if (option.value === 'aws-option') {
        return { label: 'No application', value: '' };
      }

      return option;
    };

    render(
      <FormRenderer
        {...initialProps}
        schema={{
          fields: [
            {
              component: componentTypes.TEXT_FIELD,
              name: 'source_type',
              'aria-label': 'source_type',
            },
            {
              component: 'enhanced-radio',
              options: [
                { label: 'option', value: 'aws-option' },
                { label: 'option-1', value: 'second-option' },
              ],
              mutator,
              name: 'radio',
            },
          ],
        }}
        initialValues={{
          source_type: 'aws',
        }}
      />
    );

    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      radio: 'aws-option',
      source_type: 'aws',
    });
    onSubmit.mockReset();

    await user.clear(screen.getByLabelText('source_type'));
    await user.type(screen.getByLabelText('source_type'), 'some-value');
    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      radio: '',
      source_type: 'some-value',
    });
    onSubmit.mockReset();
  });
});
