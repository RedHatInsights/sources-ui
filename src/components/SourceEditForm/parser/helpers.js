import { EDIT_FIELD_NAME } from '../../editField/EditField';

export const modifyFields = (fields, editing, setEdit) => fields.map((field) => {
    const isEditing = editing[field.name];

    const finalField = ({
        ...field,
        component: isEditing ? field.component : EDIT_FIELD_NAME
    });

    if (!isEditing) {
        finalField.setEdit = setEdit;
    }

    return finalField;
});
