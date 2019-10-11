import { compileAllSourcesComboOptions, initialValues } from '../../../components/SourceEditForm/editSourceSchema';
import { endpointToUrl } from '../../../components/SourcesSimpleView/formatters';

describe('editSourceSchema', () => {
    describe('compileAllSourcesComboOptions', () => {
        const NAMES = ['name_1', 'name_2'];
        const PRODUCT_NAMES = ['product_name_1', 'product_name_2'];
        const SOURCE_TYPES = [
            { name: NAMES[0], product_name: PRODUCT_NAMES[0] },
            { name: NAMES[1], product_name: PRODUCT_NAMES[1] }
        ];
        const EXPECTED_OPTIONS = [
            { value: NAMES[0], label: PRODUCT_NAMES[0] },
            { value: NAMES[1], label: PRODUCT_NAMES[1] }
        ];
        it('returns source types converted to options', () => {
            expect(compileAllSourcesComboOptions(SOURCE_TYPES)).toEqual(EXPECTED_OPTIONS);
        });
    });

    describe('initialValues', () => {
        const SOURCE = {
            authentication: {
                authtype: 'username_password'
            },
            additionalThings: {
                cosi: 'cosi'
            },
            endpoint: {
                scheme: 'http',
                path: '/',
                host: 'red.hat',
                port: '8O'

            },
            source: {
                name: 'source_name'
            },
            source_type: 'amazon'
        };
        const EXPECTED_VALUES = {
            auth_select: SOURCE.authentication.authtype,
            authentication: SOURCE.authentication,
            endpoint: SOURCE.endpoint,
            url: endpointToUrl(SOURCE.endpoint),
            source: SOURCE.source,
            source_type: SOURCE.source_type
        };

        it('returns only required values', () => {
            expect(initialValues(SOURCE)).toEqual(EXPECTED_VALUES);
        });

        it('returns only required values wihout endpoint', () => {
            expect(initialValues({ ...SOURCE, endpoint: undefined })).toEqual(
                { ...EXPECTED_VALUES, endpoint: undefined, url: '' }
            );
        });
    });
});
