import { convertToUndefined } from '../../api/doAttachApp';

describe('convertToUndefined', () => {
    it('converts a object with undefined to null', () => {
        const values = {
            authentication: undefined,
            endpoint: {
                url: undefined,
                port: 123
            },
            name: 'pepa'
        };

        const EXPECTED_OBJECT = {
            authentication: null,
            endpoint: {
                url: null,
                port: 123
            },
            name: 'pepa'
        };

        expect(convertToUndefined(values)).toEqual(EXPECTED_OBJECT);
    });

    it('converts a object with array to null', () => {
        const values = {
            authentication: undefined,
            endpoint: [
                undefined,
                1232
            ],
            name: 'pepa'
        };

        const EXPECTED_OBJECT = {
            authentication: null,
            endpoint: [
                null,
                1232
            ],
            name: 'pepa'
        };

        expect(convertToUndefined(values)).toEqual(EXPECTED_OBJECT);
    });

    it('does not convert anything', () => {
        const values = {
            authentication: {
                extra: {
                    azure: {
                        id: 12
                    }
                }
            }
        };

        expect(convertToUndefined(values)).toEqual(values);
    });

    it('nested conversion', () => {
        const values = {
            authentication: {
                extra: {
                    azure: {
                        id: undefined
                    }
                }
            }
        };

        const EXPECTED_OBJECT = {
            authentication: {
                extra: {
                    azure: {
                        id: null
                    }
                }
            }
        };

        expect(convertToUndefined(values)).toEqual(EXPECTED_OBJECT);
    });
});
