import { componentTypes } from '@data-driven-forms/react-form-renderer';
import validatorTypes from '@data-driven-forms/react-form-renderer/dist/cjs/validator-types';

import { genericInfo } from '../../../../components/SourceEditForm/parser/genericInfo';
import AdditionalInfoBar from '../../../../components/SourceEditForm/parser/AdditionalInfoBar';

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/SourceAddSchema', () => ({
    __esModule: true,
    asyncValidatorDebounced: jest.fn().mockImplementation(() => jest.fn())
}));

describe('generic info edit form parser', () => {
    const SOURCE_ID = '1233465';
    const INTL = { formatMessage: ({ defaultMessage }) => defaultMessage };

    it('should generate generic info form group', () => {
        const EXPECTED_TYPE_FIELD = {
            name: 'additional_info',
            component: 'description',
            Content: AdditionalInfoBar
        };
        const EXPECTED_NAME_FIELD = {
            name: 'source.name',
            label: 'Source name',
            validate: [
                expect.any(Function),
                { type: validatorTypes.REQUIRED }
            ],
            isRequired: true,
            component: componentTypes.TEXT_FIELD,
            resolveProps: expect.any(Function)
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
