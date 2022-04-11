import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { validatorTypes } from '@data-driven-forms/react-form-renderer';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import { componentWrapperIntl } from '../../utilities/testsHelpers';

import Authentication from '../../components/Authentication';
import SourcesFormRenderer from '../../utilities/SourcesFormRenderer';

describe('Authentication test', () => {
  let schema;
  let onSubmit;
  let initialProps;

  beforeEach(() => {
    schema = {
      fields: [
        {
          component: 'authentication',
          name: 'authentication.password',
          validate: [
            { type: validatorTypes.REQUIRED },
            {
              type: validatorTypes.MIN_LENGTH,
              threshold: 2,
            },
          ],
          isRequired: true,
        },
      ],
    };
    onSubmit = jest.fn();
    initialProps = {
      formFieldsMapper: {
        authentication: Authentication,
      },
      schema,
      onSubmit: (values) => onSubmit(values),
      FormTemplate,
    };
  });

  it('renders with no validation', () => {
    schema = {
      fields: [
        {
          component: 'authentication',
          name: 'authentication.password',
          isRequired: true,
        },
      ],
    };

    render(
      componentWrapperIntl(
        <SourcesFormRenderer
          {...initialProps}
          schema={schema}
          initialValues={{
            authentication: {
              id: 'someid',
            },
          }}
        />
      )
    );

    expect(screen.getByRole('textbox')).toHaveValue('•••••••••••••');
  });

  it('renders with func validation', () => {
    schema = {
      fields: [
        {
          component: 'authentication',
          name: 'authentication.password',
          isRequired: true,
          validate: [() => undefined],
        },
      ],
    };

    render(
      componentWrapperIntl(
        <SourcesFormRenderer
          {...initialProps}
          schema={schema}
          initialValues={{
            authentication: {
              id: 'someid',
            },
          }}
        />
      )
    );

    expect(screen.getByRole('textbox')).toHaveValue('•••••••••••••');
  });

  it('renders not editing', async () => {
    render(componentWrapperIntl(<SourcesFormRenderer {...initialProps} />));

    expect(screen.getByRole('textbox')).toBeRequired();

    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.type(screen.getByRole('textbox'), 's');
    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).not.toHaveBeenCalled();

    await userEvent.type(screen.getByRole('textbox'), 'ome-value');

    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      authentication: {
        password: 'some-value',
      },
    });
  });

  it('renders editing and removes required validator (min length still works)', async () => {
    render(
      componentWrapperIntl(
        <SourcesFormRenderer
          {...initialProps}
          initialValues={{
            authentication: {
              id: 'someid',
            },
          }}
        />
      )
    );

    expect(screen.getByRole('textbox')).toHaveValue('•••••••••••••');

    await userEvent.click(screen.getByRole('textbox'));

    expect(screen.getByRole('textbox')).toHaveValue('');

    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      authentication: {
        id: 'someid',
      },
    });
    onSubmit.mockClear();

    await userEvent.type(screen.getByRole('textbox'), 's');
    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('reset when form resets', async () => {
    render(
      componentWrapperIntl(
        <SourcesFormRenderer
          {...initialProps}
          FormTemplate={(props) => <FormTemplate {...props} canReset />}
          initialValues={{
            authentication: {
              id: 'someid',
            },
          }}
        />
      )
    );

    expect(screen.getByRole('textbox')).toHaveValue('•••••••••••••');

    await userEvent.click(screen.getByRole('textbox'));

    expect(screen.getByRole('textbox')).toHaveValue('');

    await userEvent.type(screen.getByRole('textbox'), 's');
    await userEvent.click(screen.getByText('Reset'));

    expect(screen.getByRole('textbox')).toHaveValue('•••••••••••••');
  });

  it('renders disabled with no focus event', async () => {
    render(
      componentWrapperIntl(
        <SourcesFormRenderer
          {...initialProps}
          schema={{
            fields: [
              {
                component: 'authentication',
                name: 'authentication.password',
                isDisabled: true,
              },
            ],
          }}
          initialValues={{
            authentication: {
              id: 'someid',
            },
          }}
        />
      )
    );

    expect(screen.getByRole('textbox')).toHaveValue('•••••••••••••');
    expect(screen.getByRole('textbox')).toBeDisabled();

    await userEvent.click(screen.getByRole('textbox'));

    expect(screen.getByRole('textbox')).toHaveValue('•••••••••••••');
    expect(screen.getByRole('textbox')).toBeDisabled();
  });
});
