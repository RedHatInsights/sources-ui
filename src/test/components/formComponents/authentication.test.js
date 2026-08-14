import React from 'react';

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { validatorTypes } from '@data-driven-forms/react-form-renderer';
import componentMapper from '@data-driven-forms/pf4-component-mapper/component-mapper';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import render from '../../addSourceWizard/__mocks__/render';
import SourcesFormRenderer from '../../../utilities/SourcesFormRenderer';
import Authentication from '../../../components/FormComponents/Authentication';

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
          label: 'API key',
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
      componentMapper: {
        ...componentMapper,
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
      <SourcesFormRenderer
        {...initialProps}
        schema={schema}
        initialValues={{
          authentication: {
            id: 'someid',
          },
        }}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'authentication.password');
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
      <SourcesFormRenderer
        {...initialProps}
        schema={schema}
        initialValues={{
          authentication: {
            id: 'someid',
          },
        }}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'authentication.password');
  });

  it('renders not editing', async () => {
    const user = userEvent.setup();

    render(<SourcesFormRenderer {...initialProps} />);

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'authentication.password');
    expect(screen.getByText('*')).toBeInTheDocument();
    expect(() => screen.getByText('Changing this resets your current API key.')).toThrow();

    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(onSubmit).not.toHaveBeenCalled();

    await waitFor(async () => {
      await user.type(screen.getByRole('textbox'), 's'); // too short
    });

    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(onSubmit).not.toHaveBeenCalled();

    await waitFor(async () => {
      await user.type(screen.getByRole('textbox'), 'ome-value'); // too short
    });

    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith({
      authentication: {
        password: 'some-value',
      },
    });
  });

  it('renders editing and removes required validator (min length still works)', async () => {
    const user = userEvent.setup();

    render(
      <SourcesFormRenderer
        {...initialProps}
        initialValues={{
          authentication: {
            id: 'someid',
          },
        }}
      />,
    );

    expect(screen.getByRole('textbox')).toHaveAttribute('name', 'authentication.password');
    expect(() => screen.getByText('*')).toThrow();
    expect(screen.getByText('Changing this resets your current API key.')).toBeInTheDocument();

    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(onSubmit).toHaveBeenCalledWith({
      authentication: {
        id: 'someid',
      },
    });
    onSubmit.mockClear();

    await waitFor(async () => {
      await user.clear(screen.getByRole('textbox'));
    });
    await waitFor(async () => {
      await user.type(screen.getByRole('textbox'), 's'); // too short
    });
    await waitFor(async () => {
      await user.click(screen.getByText('Submit'));
    });

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
