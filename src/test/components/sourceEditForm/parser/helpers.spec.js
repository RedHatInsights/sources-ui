import { componentTypes } from '@data-driven-forms/react-form-renderer';
import { modifyFields } from '../../../../components/SourceEditForm/parser/helpers';
import { EDIT_FIELD_NAME } from '../../../../components/editField/EditField';

describe('source edit form parser helpers', () => {
    describe('modifyFields', () => {
        const NAME = '123';
        const FIELDS = [{ component: componentTypes.TEXT_FIELD, name: NAME }];

        it('adds component type when not editing', () => {
            const EDITING = {};
            const SET_EDIT = jest.fn();

            expect(modifyFields(FIELDS, EDITING, SET_EDIT)).toEqual([
                {
                    ...FIELDS[0],
                    component: EDIT_FIELD_NAME,
                    setEdit: SET_EDIT
                }
            ]);
        });

        it('adds nothing type when editing', () => {
            const EDITING = { [NAME]: true };
            const SET_EDIT = jest.fn();

            expect(modifyFields(FIELDS, EDITING, SET_EDIT)).toEqual(FIELDS);
        });
    });
});
