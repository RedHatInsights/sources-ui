import { EDIT_FIELD_NAME } from '../../EditField/EditField';
import { componentTypes } from '@data-driven-forms/react-form-renderer';

export const NOT_CHANGING_COMPONENTS = [componentTypes.CHECKBOX, componentTypes.SWITCH];

export const modifyFields = (fields, editing, setEdit) => fields.map((field) => {
    const isEditing = editing[field.name];

    const finalField = ({
        ...field,
        component: isEditing || NOT_CHANGING_COMPONENTS.includes(field.component)  ? field.component : EDIT_FIELD_NAME
    });

    if (!isEditing && !NOT_CHANGING_COMPONENTS.includes(field.component)) {
        finalField.setEdit = setEdit;
    }

    return finalField;
});
