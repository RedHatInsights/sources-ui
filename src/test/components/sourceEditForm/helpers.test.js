import { prepareInitialValues, selectOnlyEditedValues } from '../../../components/SourceEditForm/helpers';

describe('edit form helpers', () => {
    describe('selectOnlyEditedValues', () => {
        it('returns only edited values', () => {
            const VALUES = {
                nested: {
                    name: '1'
                },
                url: 'http://redhat.com',
                nonEditedValue: 'something'
            };

            const EDITING = {
                'nested.name': true,
                url: true
            };

            const EXPECTED_VALUES = {
                nested: {
                    name: '1'
                },
                url: 'http://redhat.com'
            };

            expect(selectOnlyEditedValues(VALUES, EDITING)).toEqual(EXPECTED_VALUES);
        });
    });

    describe('prepareInitialValues', () => {
        const SOURCE_TYPE_NAME = 'openshift';

        const AUTH_ID1 = '123';
        const AUTH_ID2 = '2342';

        const SOURCE = {
            source: { name: 'name' },
            endpoints: [{ id: '123' }],
            authentications: [
                { id: AUTH_ID1 },
                { id: AUTH_ID2 }
            ]
        };

        const EXPECTED_INITIAL_VALUES = {
            source: SOURCE.source,
            endpoint: SOURCE.endpoints[0],
            authentications: {
                [`a${AUTH_ID1}`]: SOURCE.authentications[0],
                [`a${AUTH_ID2}`]: SOURCE.authentications[1]
            },
            source_type: SOURCE_TYPE_NAME,
            url: undefined
        };

        it('prepares initial values', () => {
            expect(prepareInitialValues(SOURCE, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES);
        });

        it('prepares initial values with apps auths', () => {
            const SOURCE_WITH_APPS = {
                ...SOURCE,
                applications: [{
                    authentications: [{
                        authtype: 'super-type-1',
                        id: 'st1'
                    }, {
                        authtype: 'super-type-2',
                        id: 'st2'
                    }]
                },
                {
                    authentications: [{
                        authtype: 'super-type-3',
                        id: 'st3'
                    }]
                }]
            };

            expect(prepareInitialValues(SOURCE_WITH_APPS, SOURCE_TYPE_NAME)).toEqual({
                ...EXPECTED_INITIAL_VALUES,
                authentications: {
                    ...EXPECTED_INITIAL_VALUES.authentications,
                    ast1: {
                        authtype: 'super-type-1',
                        id: 'st1'
                    },
                    ast2: {
                        authtype: 'super-type-2',
                        id: 'st2'
                    },
                    ast3: {
                        authtype: 'super-type-3',
                        id: 'st3'
                    }
                }
            });
        });

        it('prepares initial values with URL', () => {
            const SOURCE_WITH_URL = {
                ...SOURCE,
                endpoints: [{ id: '123', scheme: 'https', host: 'redhat.com' }]
            };

            const EXPECTED_INITIAL_VALUES_WITH_URL = {
                ...EXPECTED_INITIAL_VALUES,
                endpoint: SOURCE_WITH_URL.endpoints[0],
                url: `${SOURCE_WITH_URL.endpoints[0].scheme}://${SOURCE_WITH_URL.endpoints[0].host}`
            };

            expect(prepareInitialValues(SOURCE_WITH_URL, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_URL);
        });

        it('prepares initial values with empty authetications', () => {
            const SOURCE_WITH_NO_AUTHS = {
                ...SOURCE,
                authentications: []
            };

            const EXPECTED_INITIAL_VALUES_WITH_NO_AUTHS = {
                ...EXPECTED_INITIAL_VALUES,
                authentications: {}
            };

            expect(prepareInitialValues(SOURCE_WITH_NO_AUTHS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_NO_AUTHS);
        });

        it('prepares initial values with undefined authetications', () => {
            const SOURCE_WITH_UNDEF_AUTHS = {
                ...SOURCE,
                authentications: undefined
            };

            const EXPECTED_INITIAL_VALUES_WITH_UNDEF_AUTHS = {
                ...EXPECTED_INITIAL_VALUES,
                authentications: {}
            };

            expect(prepareInitialValues(SOURCE_WITH_UNDEF_AUTHS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_UNDEF_AUTHS);
        });

        it('prepares initial values with empty endpoint', () => {
            const SOURCE_WITH_NO_ENDPOINTS = {
                ...SOURCE,
                endpoints: []
            };

            const EXPECTED_INITIAL_VALUES_WITH_NO_ENDPOINTS = {
                ...EXPECTED_INITIAL_VALUES,
                endpoint: undefined
            };

            expect(prepareInitialValues(SOURCE_WITH_NO_ENDPOINTS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_NO_ENDPOINTS);
        });

        it('prepares initial values with undefined endpoints', () => {
            const SOURCE_WITH_UNDEF_ENDPOINTS = {
                ...SOURCE,
                endpoints: undefined
            };

            const EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS = {
                ...EXPECTED_INITIAL_VALUES,
                endpoint: undefined
            };

            expect(prepareInitialValues(SOURCE_WITH_UNDEF_ENDPOINTS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS);
        });

        it('prepares initial values with cost management values', () => {
            const SOURCE_WITH_UNDEF_ENDPOINTS = {
                ...SOURCE,
                billing_source: { bucket: 'bucket' },
                credentials: { subscription_id: '122' }
            };

            const EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS = {
                ...EXPECTED_INITIAL_VALUES,
                billing_source: { bucket: 'bucket' },
                credentials: { subscription_id: '122' }
            };

            expect(prepareInitialValues(SOURCE_WITH_UNDEF_ENDPOINTS, SOURCE_TYPE_NAME)).toEqual(EXPECTED_INITIAL_VALUES_WITH_UNDEF_ENDPOINTS);
        });
    });
});
