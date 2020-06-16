import { EDIT_FIELD_NAME } from '../../EditField/EditField';

export const modifyFields = (fields) => fields.map((field) => ({
    ...field,
    originalComponent: field.component,
    component: EDIT_FIELD_NAME
}));
