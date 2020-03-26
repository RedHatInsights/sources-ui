import { componentTypes } from '@data-driven-forms/react-form-renderer';

import { genericInfo } from '../../../../components/SourceEditForm/parser/genericInfo';
import { EDIT_FIELD_NAME } from '../../../../components/EditField/EditField';

jest.mock('@redhat-cloud-services/frontend-components-sources', () => ({
    asyncValidator: jest.fn().mockImplementation(() => jest.fn())
}));

describe('generic info edit form parser', () => {
    const EDITING = {};
    const SET_EDIT = jest.fn();
    const SOURCE_ID = '1233465';

    const EXPECTED_TYPE_FIELD = {
        name: 'source_type',
        label: expect.any(Object),
        isReadOnly: true,
        component: EDIT_FIELD_NAME
    };

    it('should generate generic info form group when not editing name', () => {
        const EXPECTED_NAME_FIELD = {
            name: 'source.name',
            label: expect.any(Object),
            component: EDIT_FIELD_NAME,
            setEdit: SET_EDIT,
            validate: [
                expect.any(Function)
            ],
            isRequired: true
        };

        const EXPECTED_FORM_GROUP = [
            expect.objectContaining(EXPECTED_NAME_FIELD),
            expect.objectContaining(EXPECTED_TYPE_FIELD)
        ];

        expect(genericInfo(EDITING, SET_EDIT, SOURCE_ID)).toEqual(EXPECTED_FORM_GROUP);
    });

    it('should generate generic info form group when editing name', () => {
        const EDITING = { 'source.name': true };
        const SET_EDIT = jest.fn();
        const SOURCE_ID = '1233465';

        const EXPECTED_NAME_FIELD = {
            name: 'source.name',
            label: expect.any(Object),
            component: componentTypes.TEXT_FIELD,
            validate: [
                expect.any(Function)
            ],
            isRequired: true
        };

        const EXPECTED_FORM_GROUP = [
            expect.objectContaining(EXPECTED_NAME_FIELD),
            expect.objectContaining(EXPECTED_TYPE_FIELD)
        ];

        expect(genericInfo(EDITING, SET_EDIT, SOURCE_ID)).toEqual(EXPECTED_FORM_GROUP);
    });

    it('should return debounced validate function', () => {
        const schema = genericInfo(EDITING, SET_EDIT, SOURCE_ID);

        const returnedFunction = schema[0].validate[0]('some value', SOURCE_ID);

        expect(returnedFunction).toEqual(expect.any(Function));
    });
});
