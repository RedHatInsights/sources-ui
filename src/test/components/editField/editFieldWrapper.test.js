import FormRenderer from '@data-driven-forms/react-form-renderer/dist/cjs/form-renderer';
import FormTemplate from '@data-driven-forms/pf4-component-mapper/dist/cjs/form-template';
import componentTypes from '@data-driven-forms/react-form-renderer/dist/cjs/component-types';
import componentMapper from '@data-driven-forms/pf4-component-mapper/dist/cjs/component-mapper';

import sourceEditContext from '../../../components/SourceEditForm/sourceEditContext';
import EditFieldWrapper from '../../../components/EditField/EditFieldWrapper';
import EditField, { EDIT_FIELD_NAME } from '../../../components/EditField/EditField';

describe('Edit field wrapper', () => {
    const ComponentWrapper = ({ editing = {}, ...props }) => (<sourceEditContext.Provider value={{ editing, setState: jest.fn() }}>
        <FormRenderer {...props} />
    </sourceEditContext.Provider>);

    let initialProps;
    let schema;

    beforeEach(() => {
        initialProps = {
            onSubmit: jest.fn(),
            FormTemplate,
            componentMapper: {
                ...componentMapper,
                [EDIT_FIELD_NAME]: EditFieldWrapper
            }
        };
    });

    it('renders edit component', () => {
        schema = {
            fields: [{
                component: EDIT_FIELD_NAME,
                originalComponent: componentTypes.TEXT_FIELD,
                name: 'text-field',
                label: 'text-field-label'
            }]
        };

        const wrapper = mount(<ComponentWrapper {...initialProps} schema={schema} />);

        expect(wrapper.find(EditField)).toHaveLength(1);
        expect(wrapper.find(EditField).props().isEditable).toEqual(true);
        expect(wrapper.find(componentMapper[componentTypes.TEXT_FIELD])).toHaveLength(0);
    });

    it('renders uneditable component', () => {
        schema = {
            fields: [{
                component: EDIT_FIELD_NAME,
                originalComponent: componentTypes.TEXT_FIELD,
                name: 'text-field',
                label: 'text-field-label',
                isEditable: false
            }]
        };

        const wrapper = mount(<ComponentWrapper {...initialProps} schema={schema} />);

        expect(wrapper.find(EditField)).toHaveLength(1);
        expect(wrapper.find(EditField).props().isEditable).toEqual(undefined);
        expect(wrapper.find(componentMapper[componentTypes.TEXT_FIELD])).toHaveLength(0);
    });

    it('renders switch component', () => {
        schema = {
            fields: [{
                component: EDIT_FIELD_NAME,
                originalComponent: componentTypes.SWITCH,
                name: 'switch',
                label: 'switch',
            }]
        };

        const wrapper = mount(<ComponentWrapper {...initialProps} schema={schema} />);

        expect(wrapper.find(EditField)).toHaveLength(0);
        expect(wrapper.find(componentMapper[componentTypes.SWITCH])).toHaveLength(1);
    });

    it('renders checkbox component', () => {
        schema = {
            fields: [{
                component: EDIT_FIELD_NAME,
                originalComponent: componentTypes.CHECKBOX,
                name: 'checkbox',
                label: 'checkbox',
            }]
        };

        const wrapper = mount(<ComponentWrapper {...initialProps} schema={schema} />);

        expect(wrapper.find(EditField)).toHaveLength(0);
        expect(wrapper.find(componentMapper[componentTypes.CHECKBOX])).toHaveLength(1);
    });

    it('renders component when editing', () => {
        schema = {
            fields: [{
                component: EDIT_FIELD_NAME,
                originalComponent: componentTypes.TEXT_FIELD,
                name: 'text-field',
                label: 'text-field-label',
            }]
        };

        const wrapper = mount(<ComponentWrapper {...initialProps} schema={schema} editing={{ 'text-field': true }}/>);

        expect(wrapper.find(EditField)).toHaveLength(0);
        expect(wrapper.find(componentMapper[componentTypes.TEXT_FIELD])).toHaveLength(1);
    });
});
