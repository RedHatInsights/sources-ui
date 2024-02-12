import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import SelectWithLink from '../../../components/FormComponents/SelectWithLink';

describe('SelectWithLink component', () => {
  let initialProps;

  const componentMapper = {
    'select-with-link': SelectWithLink,
  };

  beforeEach(() => {
    initialProps = {
      onSubmit: jest.fn(),
      componentMapper,
      FormTemplate,
      schema: {
        fields: [
          {
            component: 'select-with-link',
            name: 'select-name',
            label: 'some label',
            options: [
              { label: 'Option 1', value: 'option-1' },
              { label: 'Option 2', value: 'option-2' },
            ],
            href: 'https://www.redhat.com',
          },
        ],
      },
    };
  });

  it('should render correctly', async () => {
    render(<FormRenderer {...initialProps} />);

    fireEvent.focus(screen.getByLabelText('some label'));

    await waitFor(() => {
      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Learn more')).toBeInTheDocument();
    });

    expect(screen.getByText('Learn more')).toBeInTheDocument();
  });
});
