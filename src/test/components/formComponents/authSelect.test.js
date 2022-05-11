import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import render from '../../addSourceWizard/__mocks__/render';

import AuthSelect from '../../../components/FormComponents/AuthSelect';

describe('AuthSelect component', () => {
  let initialProps;
  let onSubmit;

  const componentMapper = {
    'auth-select': AuthSelect,
  };

  beforeEach(() => {
    onSubmit = jest.fn();
    initialProps = {
      onSubmit: (values) => onSubmit(values),
      componentMapper,
      FormTemplate,
      schema: {
        fields: [
          {
            component: 'auth-select',
            label: 'Test',
            name: 'auth-select',
            authName: 'access_key_secret_key',
          },
        ],
      },
    };
  });

  it('renders correctly', () => {
    render(<FormRenderer {...initialProps} />);

    expect(screen.getByText('Test').closest('.pf-c-radio')).toBeInTheDocument();
  });

  it('renders correctly when disableAuthType', async () => {
    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            disableAuthType: true,
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    expect(screen.getByRole('radio')).toBeDisabled();
  });

  it('calls onChange correctly', async () => {
    render(<FormRenderer {...initialProps} />);

    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({});

    await userEvent.click(screen.getByRole('radio'));
    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({});
  });

  it('reset the value when unsupported auth type for application is selected', async () => {
    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            supportedAuthTypes: ['arn'],
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} initialValues={{ 'auth-select': 'access_key_secret_key' }} />);

    await userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({});
  });
});
