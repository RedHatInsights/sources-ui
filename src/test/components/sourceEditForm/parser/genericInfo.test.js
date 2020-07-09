import { componentTypes } from '@data-driven-forms/react-form-renderer';

import { genericInfo } from '../../../../components/SourceEditForm/parser/genericInfo';
import { EDIT_FIELD_NAME } from '../../../../components/EditField/EditField';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/SourceAddSchema', () => ({
    __esModule: true,
    asyncValidatorDebounced: jest.fn().mockImplementation(() => jest.fn())
}));

describe('generic info edit form parser', () => {
    const SOURCE_ID = '1233465';
    const INTL = { formatMessage: jest.fn() };

    it('should generate generic info form group', () => {

        const EXPECTED_TYPE_FIELD = {
            name: 'source_type',
            label: expect.any(Object),
            isReadOnly: true,
            component: EDIT_FIELD_NAME,
        };
        const EXPECTED_NAME_FIELD = {
            name: 'source.name',
            label: expect.any(Object),
            validate: [
                expect.any(Function),
                { type: validatorTypes.REQUIRED }
            ],
            isRequired: true,
            originalComponent: componentTypes.TEXT_FIELD,
            component: EDIT_FIELD_NAME,
        };

        const EXPECTED_FORM_GROUP = [
            expect.objectContaining(EXPECTED_NAME_FIELD),
            expect.objectContaining(EXPECTED_TYPE_FIELD)
        ];

        expect(genericInfo(SOURCE_ID, INTL)).toEqual(EXPECTED_FORM_GROUP);
    });

    it('should return debounced validate function', () => {
        const schema = genericInfo(SOURCE_ID, INTL);

        const returnedFunction = schema[0].validate[0]('some value', SOURCE_ID, INTL);

        expect(returnedFunction).toEqual(expect.any(Function));
    });
});
