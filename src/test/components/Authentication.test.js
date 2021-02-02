import React from 'react';
import { act } from 'react-dom/test-utils';

import { FormGroup, TextInput, Button } from '@patternfly/react-core';
import { validatorTypes } from '@data-driven-forms/react-form-renderer';

import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/esm/form-template';
import TextField from '@data-driven-forms/pf4-component-mapper/dist/esm/text-field';

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

    const wrapper = mount(
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

    expect(wrapper.find(Authentication)).toHaveLength(1);
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

    const wrapper = mount(
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

    expect(wrapper.find(Authentication)).toHaveLength(1);
  });

  it('renders not editing', () => {
    const wrapper = mount(componentWrapperIntl(<SourcesFormRenderer {...initialProps} />));

    expect(wrapper.find(Authentication)).toHaveLength(1);

    expect(wrapper.find(TextField).props().isRequired).toEqual(true);
    expect(wrapper.find(TextField).props().helperText).toEqual(undefined);

    wrapper.find('form').simulate('submit');
    wrapper.update();

    expect(onSubmit).not.toHaveBeenCalled();

    wrapper.find('input').instance().value = 's'; // too short
    wrapper.find('input').simulate('change');
    wrapper.update();

    wrapper.find('form').simulate('submit');
    wrapper.update();

    expect(onSubmit).not.toHaveBeenCalled();

    wrapper.find('input').instance().value = 'some-value';
    wrapper.find('input').simulate('change');
    wrapper.update();

    wrapper.find('form').simulate('submit');
    expect(onSubmit).toHaveBeenCalledWith({
      authentication: {
        password: 'some-value',
      },
    });
  });

  it('renders editing and removes required validator (min length still works)', async () => {
    const wrapper = mount(
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

    expect(wrapper.find(FormGroup)).toHaveLength(1);
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find(TextInput).props().value).toEqual('•••••••••••••');

    await act(async () => {
      wrapper.find(FormGroup).first().simulate('focus');
    });
    wrapper.update();

    expect(wrapper.find(Authentication)).toHaveLength(1);

    wrapper.find('form').simulate('submit');
    wrapper.update();

    expect(onSubmit).toHaveBeenCalledWith({
      authentication: {
        id: 'someid',
      },
    });
    onSubmit.mockClear();

    wrapper.find('input').instance().value = 's';
    wrapper.find('input').simulate('change');
    wrapper.update();

    wrapper.find('form').simulate('submit');
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('reset when form resets', async () => {
    let wrapper;

    await act(async () => {
      wrapper = mount(
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
    });

    expect(wrapper.find(FormGroup)).toHaveLength(1);
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find(TextInput).props().value).toEqual('•••••••••••••');
    expect(wrapper.find(TextField)).toHaveLength(0);

    await act(async () => {
      wrapper.find(FormGroup).first().simulate('focus');
    });
    wrapper.update();

    expect(wrapper.find(Authentication)).toHaveLength(1);
    expect(wrapper.find(TextField)).toHaveLength(1);

    await act(async () => {
      wrapper.find('input').instance().value = 's';
      wrapper.find('input').simulate('change');
      wrapper.update();
    });
    wrapper.update();

    // reset
    await act(async () => {
      wrapper.find(Button).at(1).simulate('click');
    });
    wrapper.update();

    expect(wrapper.find(FormGroup)).toHaveLength(1);
    expect(wrapper.find(TextInput)).toHaveLength(1);
    expect(wrapper.find(TextInput).props().value).toEqual('•••••••••••••');
    expect(wrapper.find(TextField)).toHaveLength(0);
  });
});
