import React from 'react';
import { render, screen, fireEvent, createEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { Tile } from '@patternfly/react-core';
import { AwsIcon, OpenshiftIcon } from '@patternfly/react-icons';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import CardSelect from '../../../components/FormComponents/CardSelect';

describe('CardSelect component', () => {
  let initialProps;
  let onSubmit;

  const componentMapper = {
    'card-select': CardSelect,
  };

  beforeEach(() => {
    onSubmit = jest.fn();
    initialProps = {
      initialValues: {
        pre: 'filled',
      },
      onSubmit: (values) => onSubmit(values),
      componentMapper,
      FormTemplate,
      schema: {
        fields: [
          {
            component: 'card-select',
            name: 'card-select',
            options: [
              { value: 'ops', label: 'openshift' },
              { value: 'aws', label: 'aws' },
              { label: 'Choose one (this should not be displayed)' },
            ],
          },
        ],
      },
    };
  });

  it('should render correctly', () => {
    render(<FormRenderer {...initialProps} />);

    expect(screen.getByText('openshift')).toBeInTheDocument();
    expect(screen.getByText('aws')).toBeInTheDocument();

    expect(() => screen.getByText('Choose one (this should not be displayed)')).toThrow();
  });

  it('should render correctly with icon mapper - do not show text for icons', () => {
    const Icon = () => <h1>someIcon</h1>;

    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            component: 'card-select',
            name: 'card-select',
            iconMapper: (value) => (value === 'ops' ? Icon : undefined),
            options: [
              { value: 'ops', label: 'openshift' },
              { value: 'amazon', label: 'AWS' },
            ],
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    expect(screen.getByText('openshift')).toBeInTheDocument();
    expect(screen.getByText('someIcon')).toBeInTheDocument();

    expect(screen.getByText('AWS')).toBeInTheDocument();
  });

  it('should render correctly with mutator and it passes formOptions', () => {
    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            mutator: ({ label, value }, formOptions) => ({ label: `AAA-${label}-${formOptions.getState().values.pre}`, value }),
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    expect(screen.getByText('AAA-openshift-filled')).toBeInTheDocument();
    expect(screen.getByText('AAA-aws-filled')).toBeInTheDocument();
  });

  it('should render correctly with default icon', () => {
    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            DefaultIcon: () => <AwsIcon aria-label="aws-icon" />,
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    expect(screen.getAllByLabelText('aws-icon')).toHaveLength(2);
  });

  it('should render correctly one item disabled', () => {
    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            options: [...initialProps.schema.fields[0].options, { value: 'azure', label: 'MS Azure', isDisabled: true }],
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    expect(screen.getByText('MS Azure').closest('.pf-c-tile')).toHaveClass('pf-m-disabled');
  });

  it('should render correctly with iconMapper', () => {
    const iconMapper = (value, defaultIcon) =>
      ({
        aws: () => <AwsIcon aria-label="aws-icon" />,
        ops: () => <OpenshiftIcon aria-label="openshift-icon" />,
      }[value] || defaultIcon);

    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            iconMapper,
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    expect(screen.getByLabelText('aws-icon')).toBeInTheDocument();
    expect(screen.getByLabelText('openshift-icon')).toBeInTheDocument();
  });

  it('should set default value', () => {
    render(<FormRenderer {...initialProps} initialValues={{ 'card-select': 'ops' }} />);

    userEvent.click(screen.getByText('openshift'));
    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({});
  });

  it('should clicked single select', () => {
    render(<FormRenderer {...initialProps} />);

    userEvent.click(screen.getByText('openshift'));
    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      pre: 'filled',
      'card-select': 'ops',
    });
  });

  it('should change by pressing enter single select', () => {
    render(<FormRenderer {...initialProps} />);

    const preventDefaultMock = jest.fn();

    userEvent.tab();
    userEvent.tab();

    expect(screen.getByText('aws').closest('.pf-c-tile')).toHaveFocus();

    const myEvent = createEvent.keyPress(screen.getByText('aws').closest('.pf-c-tile'), {
      key: 'Space',
      code: 32,
      charCode: 32,
    });
    myEvent.preventDefault = preventDefaultMock;

    fireEvent(screen.getByText('aws').closest('.pf-c-tile'), myEvent);

    expect(preventDefaultMock).toHaveBeenCalled();

    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      pre: 'filled',
      'card-select': 'aws',
    });

    // unselect
    fireEvent(screen.getByText('aws').closest('.pf-c-tile'), myEvent);
    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      pre: 'filled',
    });
  });

  it('should not change by pressing shift single select', () => {
    render(<FormRenderer {...initialProps} />);

    userEvent.tab();
    userEvent.tab();
    userEvent.keyboard('{Shift}');
    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      pre: 'filled',
    });
  });

  it('should not clicked disabled', () => {
    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            isDisabled: true,
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    userEvent.click(screen.getByText('openshift'));

    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      pre: 'filled',
    });
  });

  it('should clicked multiSelect select', () => {
    initialProps = {
      ...initialProps,
      schema: {
        fields: [
          {
            ...initialProps.schema.fields[0],
            isMulti: true,
          },
        ],
      },
    };

    render(<FormRenderer {...initialProps} />);

    userEvent.click(screen.getByText('openshift'));
    userEvent.click(screen.getByText('aws'));
    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      pre: 'filled',
      'card-select': ['ops', 'aws'],
    });

    userEvent.click(screen.getByText('openshift'));
    userEvent.click(screen.getByText('Submit'));

    expect(onSubmit).toHaveBeenCalledWith({
      pre: 'filled',
      'card-select': ['aws'],
    });
  });
});
