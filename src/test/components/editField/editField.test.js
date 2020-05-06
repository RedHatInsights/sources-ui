import { FormGroup } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import EditField, { EDIT_FIELD_NAME } from '../../../components/EditField/EditField';

describe('Edit field', () => {
    let initialProps;

    const NAME = 'name1234';
    const VALUE = 'password';

    const SPACE_CODE = 32;

    const componentMapper = {
        [EDIT_FIELD_NAME]: EditField
    };

    beforeEach(() => {
        initialProps = {
            componentMapper,
            FormTemplate,
            onSubmit: jest.fn(),
            schema: {
                fields: [{
                    name: NAME,
                    component: EDIT_FIELD_NAME
                }]
            }
        };
    });

    it('renders correctly', () => {
        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find(FormGroup)).toHaveLength(1);
        expect(wrapper.find('span')).toHaveLength(1);
        expect(wrapper.find(PencilAltIcon)).toHaveLength(0);
    });

    it('renders correctly with error', () => {
        const ERROR = 'errror';

        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    validate: [{ type: validatorTypes.REQUIRED, message: ERROR }]
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        wrapper.find('form').simulate('submit');
        wrapper.update();

        expect(wrapper.find(FormGroup).props().isValid).toEqual(false);
        expect(wrapper.find(FormGroup).props().helperTextInvalid).toEqual(ERROR);
    });

    it('renders correctly with value', () => {
        initialProps = {
            ...initialProps,
            initialValues: {
                [NAME]: VALUE
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find('span').text()).toEqual(VALUE);
        expect(wrapper.find(PencilAltIcon)).toHaveLength(0);
    });

    it('renders correctly true', () => {
        initialProps = {
            ...initialProps,
            initialValues: {
                [NAME]: true
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find('span').text()).toEqual('True');
    });

    it('renders correctly false', () => {
        initialProps = {
            ...initialProps,
            initialValues: {
                [NAME]: false
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find('span').text()).toEqual('False');
    });

    it('renders empty - Click to add', () => {
        initialProps = {
            ...initialProps,
            initialValues: {
                [NAME]: undefined
            },
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    setEdit: jest.fn()
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find('span').text().includes('add')).toEqual(true);
    });

    it('renders empty password - Click to edit', () => {
        initialProps = {
            ...initialProps,
            initialValues: {
                [NAME]: undefined
            },
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    setEdit: jest.fn(),
                    type: 'password'
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find('span').text().includes('edit')).toEqual(true);
    });

    it('renders empty - no value', () => {
        initialProps = {
            ...initialProps,
            initialValues: {
                [NAME]: undefined
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find('span').text()).toEqual('');
    });

    it('renders editable', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    setEdit: jest.fn()
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find(PencilAltIcon)).toHaveLength(1);
    });

    it('calls setEdit with field name', () => {
        const setEdit = jest.fn();

        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    setEdit,
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        wrapper.find(FormGroup).simulate('click');

        expect(setEdit).toHaveBeenCalledWith(NAME);
    });

    it('calls setEdit with field name by pressing space', () => {
        const setEdit = jest.fn();

        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    setEdit,
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        const event = {
            charCode: SPACE_CODE,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(setEdit).toHaveBeenCalledWith(NAME);
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('do not call setEdit with field name by pressing different key than space', () => {
        const setEdit = jest.fn();

        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    setEdit,
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        const event = {
            charCode: 31,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(setEdit).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('do nothing when setEdit is not set', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        const event = {
            charCode: SPACE_CODE,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(event.preventDefault).not.toHaveBeenCalled();
    });
});
