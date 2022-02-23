import React from 'react';

import { screen } from '@testing-library/react';

import render from '../../addSourceWizard/__mocks__/render';

import Form from '@data-driven-forms/react-form-renderer/form';

import validated, { ValidatingSpinner } from '../../../utilities/resolveProps/validated';

describe('resolveProps - validated', () => {
  it('Spinner is renderer correctly', () => {
    render(<ValidatingSpinner validating />);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Validating')).toBeInTheDocument();
  });

  const props = {};

  it('returns spinner when validating', () => {
    const result = validated(props, { meta: { validating: true } });

    render(<Form onSubmit={jest.fn()}>{() => result.helperText}</Form>);

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
    expect(screen.getByText('Validating')).toBeInTheDocument();
  });

  it('returns success state when valid', () => {
    expect(validated(props, { meta: { valid: true } })).toEqual({
      validated: 'success',
      FormGroupProps: {
        validated: 'success',
      },
    });
  });

  it('return empty object when not valid and not validating', () => {
    expect(validated(props, { meta: { valid: false, validating: false } })).toEqual({});
  });
});
