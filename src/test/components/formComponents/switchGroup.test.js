import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import SwitchGroup from '../../../components/FormComponents/SwitchGroup';

describe('Switch group', () => {
  let onSubmit;
  let initialProps;

  beforeEach(() => {
    onSubmit = jest.fn();

    initialProps = {
      subscription: { values: true },
      onSubmit: ({ source_type: _sourceType, ...values }) => onSubmit(values),
      FormTemplate,
      componentMapper: {
        'switch-group': SwitchGroup,
      },
      initialValues: { source_type: 'selected_type' },
      schema: {
        fields: [
          {
            component: 'switch-group',
            name: 'switch-group',
            label: 'Some label here',
            options: [
              { label: 'App 1', value: '1' },
              { label: 'App 2', value: '2', description: <span id="some-description">some description</span> },
              { label: 'UnsupportedApp', value: '3' },
              { label: 'Empty value - do not show me' },
            ],
            applicationTypes: [
              { id: '1', supported_source_types: ['selected_type'] },
              { id: '2', supported_source_types: ['selected_type'] },
              { id: '3', supported_source_types: [] },
            ],
          },
        ],
      },
    };
  });

  it('renders correctly, filters apptypes and sets values on initial', async () => {
    const user = userEvent.setup();

    render(<FormRenderer {...initialProps} />);

    expect(screen.getByText('Some label here')).toBeInTheDocument();
    expect(screen.getAllByText('App 1')).toBeTruthy();
    expect(screen.getAllByText('App 2')).toBeTruthy();

    expect(() => screen.getAllByText('UnsupportedApp')).toThrow();
    expect(() => screen.getAllByText('Empty value - do not show me')).toThrow();

    expect(screen.getByText('some description').closest('.src-c-wizard--switch-description')).toBeInTheDocument();

    expect(screen.getByLabelText('App 1')).toBeChecked();
    expect(screen.getByLabelText('App 2')).toBeChecked();

    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': ['1', '2'] });
  });

  it('do not set initial when values exist', async () => {
    const user = userEvent.setup();

    render(<FormRenderer {...initialProps} initialValues={{ 'switch-group': '123' }} />);

    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': '123' });
  });

  it('handle onChange', async () => {
    const user = userEvent.setup();

    render(<FormRenderer {...initialProps} />);

    await user.click(screen.getAllByText('App 1')[0]);
    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': ['2'] });
    onSubmit.mockClear();

    await user.click(screen.getAllByText('App 2')[0]);
    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': [] });
    onSubmit.mockClear();

    await user.click(screen.getAllByText('App 2')[0]);
    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': ['2'] });
    onSubmit.mockClear();

    await user.click(screen.getAllByText('App 1')[0]);
    await user.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({ 'switch-group': ['2', '1'] });
    onSubmit.mockClear();
  });
});
