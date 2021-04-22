import React from 'react';
import { act } from 'react-dom/test-utils';
import { mount } from 'enzyme';

import FormRenderer from '@data-driven-forms/react-form-renderer/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/form-template';
import Checkbox from '@data-driven-forms/pf4-component-mapper/checkbox';

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
    let wrapper;
    await act(async () => {
      wrapper = mount(<FormRenderer {...initialProps} />);
    });
    wrapper.update();

    expect(wrapper.find(Checkbox)).toHaveLength(1);
    expect(wrapper.find('.pf-c-check__label').text()).toEqual('some label');
    expect(Icon).toHaveBeenCalledWith({ appendTo: undefined }, {});
  });
});
