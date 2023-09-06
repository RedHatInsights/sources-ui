import React from 'react';
import { render, screen } from '@testing-library/react';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';

import CheckboxWithIcon from '../../../components/FormComponents/CheckboxWithIcon';

describe('CardSelect component', () => {
  let initialProps;
  let Icon;

  const componentMapper = {
    'checkbox-with-icon': CheckboxWithIcon,
  };

  beforeEach(() => {
    Icon = jest.fn().mockImplementation(() => null);
    initialProps = {
      onSubmit: jest.fn(),
      componentMapper,
      FormTemplate,
      schema: {
        fields: [
          {
            component: 'checkbox-with-icon',
            name: 'checkbox-name',
            label: 'some label',
            Icon,
          },
        ],
      },
    };
  });

  it('should render correctly', async () => {
    render(<FormRenderer {...initialProps} />);

    expect(screen.getByText('some label', { selector: '.pf-v5-c-check__label' })).toBeInTheDocument();
    expect(Icon).toHaveBeenCalledWith({ appendTo: undefined }, {});
  });
});
