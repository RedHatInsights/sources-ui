import React from 'react';
import { render, screen } from '@testing-library/react';
import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import ClipboardCopy from '../../../components/FormComponents/ClipboardCopy';

describe('Description component', () => {
  let initialProps;
  let getStateSpy;

  beforeEach(() => {
    getStateSpy = jest.fn();
    initialProps = {
      name: 'copy-component',
      formOptions: {
        getState: getStateSpy,
      },
      FormTemplate,
    };
  });

  it('renders correctly', () => {
    render(
      <FormRenderer
        {...initialProps}
        schema={{
          fields: [
            {
              ...initialProps,
              component: 'clipboard-copy',
              label: 'Copy component label',
            },
          ],
        }}
        componentMapper={{ 'clipboard-copy': ClipboardCopy }}
        initialValues={{
          'copy-component': 'some value',
        }}
      />,
    );

    expect(screen.getByText('Copy component label', { selector: 'span' })).toBeInTheDocument();
    expect(screen.getByDisplayValue('some value')).toBeInTheDocument();
  });
});
