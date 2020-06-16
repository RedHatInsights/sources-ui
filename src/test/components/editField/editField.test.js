import { FormGroup } from '@patternfly/react-core';
import { PencilAltIcon } from '@patternfly/react-icons';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import FormRendererOriginal from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';

import EditField, { EDIT_FIELD_NAME } from '../../../components/EditField/EditField';
import sourceEditContext from '../../../components/SourceEditForm/sourceEditContext';

describe('Edit field', () => {
    let initialProps;
    let setState;
    let FormRenderer;

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

        setState = jest.fn();

        // eslint-disable-next-line react/display-name
        FormRenderer = (props) => (<sourceEditContext.Provider value={{ setState }}>
            <FormRendererOriginal {...props} />
        </sourceEditContext.Provider>);
    });

    it('renders correctly', () => {
        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find(FormGroup)).toHaveLength(1);
        expect(wrapper.find('span')).toHaveLength(1);
        expect(wrapper.find(PencilAltIcon)).toHaveLength(0);
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

    it('renders empty - Click to add', () => {
        initialProps = {
            ...initialProps,
            initialValues: {
                [NAME]: undefined
            },
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    isEditable: true
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
                    type: 'password',
                    isEditable: true
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
                    isEditable: true
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        expect(wrapper.find(PencilAltIcon)).toHaveLength(1);
    });

    it('calls setEdit with field name', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    isEditable: true
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        wrapper.find(FormGroup).simulate('click');

        expect(setState).toHaveBeenCalledWith({ type: 'setEdit', name: NAME });
    });

    it('calls setEdit with field name by pressing space', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    isEditable: true,
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        const event = {
            charCode: SPACE_CODE,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(setState).toHaveBeenCalledWith({ type: 'setEdit', name: NAME });
        expect(event.preventDefault).toHaveBeenCalled();
    });

    it('do not call setEdit with field name by pressing different key than space', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    isEditable: true,
                }]
            }
        };

        const wrapper = mount(<FormRenderer {...initialProps} />);

        const event = {
            charCode: 31,
            preventDefault: jest.fn()
        };

        wrapper.find(FormGroup).simulate('keypress', event);

        expect(setState).not.toHaveBeenCalled();
        expect(event.preventDefault).not.toHaveBeenCalled();
    });

    it('do nothing when setEdit is not set', () => {
        initialProps = {
            ...initialProps,
            schema: {
                fields: [{
                    ...initialProps.schema.fields[0],
                    isEditable: false
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
