import { convertToUndefined, doAttachApp, removeEmpty } from '../../api/doAttachApp';
import * as api from '../../api/entities';
import * as cm from '@redhat-cloud-services/frontend-components-sources';

const prepareFormApi = (values) => ({
    getState: () => ({
        values,
        initialValues: values
    })
});

jest.mock('@redhat-cloud-services/frontend-components-sources', () => ({
    __esModule: true,
    patchSource: jest.fn().mockImplementation(() => Promise.resolve('ok')),
    handleError: (str) => str
}));

describe('doAttachApp', () => {
    let sourceUpdate;
    let authUpdate;
    let endpointUpdate;

    let authCreate;
    let endpointCreate;

    let appCreate;

    let VALUES;
    let FORM_API;
    let AUTHENTICATION_INIT;
    let SOURCE_ID;
    let APP_ID;
    let ENDPOINT_ID;
    let RETURNED_ENDPOINT;

    let mockPatchSourceSpy;

    beforeEach(() => {
        mockPatchSourceSpy = jest.spyOn(cm, 'patchSource');

        jest.resetModules();

        RETURNED_ENDPOINT = { id: '6879778998779' };

        sourceUpdate = jest.fn().mockImplementation(() => Promise.resolve('ok'));
        authUpdate = jest.fn().mockImplementation(() => Promise.resolve('ok'));
        endpointUpdate = jest.fn().mockImplementation(() => Promise.resolve('ok'));
        authCreate = jest.fn().mockImplementation(() => Promise.resolve('ok'));
        endpointCreate = jest.fn().mockImplementation(() => Promise.resolve(RETURNED_ENDPOINT));

        api.getSourcesApi = () => ({
            updateSource: sourceUpdate,
            updateEndpoint: endpointUpdate,
            updateAuthentication: authUpdate,

            createEndpoint: endpointCreate,
            createAuthentication: authCreate
        });

        appCreate = jest.fn().mockImplementation(() => Promise.resolve('ok'));

        api.doCreateApplication = appCreate;

        SOURCE_ID = '23278326';
        VALUES = {};
        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID
            }
        });
        AUTHENTICATION_INIT = [];
        APP_ID = '878776767';
        ENDPOINT_ID = '99998887776655';
    });

    afterEach(() => {
        mockPatchSourceSpy.mockReset();
        sourceUpdate.mockReset();
        authUpdate.mockReset();
        endpointUpdate.mockReset();
        authCreate.mockReset();
        endpointCreate.mockReset();
    });

    it('no values at all - should miss source id (only developer error)', async () => {
        expect.assertions(8);

        FORM_API = prepareFormApi({});

        try {
            await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);
        } catch (error) {
            expect(error).toEqual('Missing source id');

            expect(mockPatchSourceSpy).not.toHaveBeenCalled();
            expect(sourceUpdate).not.toHaveBeenCalled();
            expect(authUpdate).not.toHaveBeenCalled();
            expect(endpointUpdate).not.toHaveBeenCalled();
            expect(authCreate).not.toHaveBeenCalled();
            expect(endpointCreate).not.toHaveBeenCalled();
            expect(appCreate).not.toHaveBeenCalled();
        }
    });

    it('only app is changed', async () => {
        VALUES = {
            application: {
                application_type_id: APP_ID
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalled();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).toHaveBeenCalledWith(SOURCE_ID, APP_ID);
    });

    it('only source is changed', async () => {
        VALUES = {
            source: {
                source_ref: '2323'
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).toHaveBeenCalledWith(SOURCE_ID, {
            source_ref: '2323'
        });
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalled();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('only source is changed and only modified (removed) values are sent to the endpoint', async () => {
        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID,
                source_ref: '2323',
                cat: 'dog',
                original: 'old'
            }
        });

        VALUES = {
            source: {
                source_ref: '2323',
                cat: undefined,
                name: '8989',
                original: 'new'
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).toHaveBeenCalledWith(SOURCE_ID, {
            cat: null,
            name: '8989',
            original: 'new'
        });
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalled();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('only source is changed and only modified (removed) values are sent to the endpoint with super nesting', async () => {
        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID,
                source_ref: '2323',
                cat: 'dog',
                original: 'old',
                modified: {
                    lojza: {
                        cat: {
                            dog: '123'
                        }
                    },
                    this: {
                        is: {
                            removed: 'mokry pes'
                        }
                    }
                }
            }
        });

        VALUES = {
            source: {
                source_ref: '2323',
                cat: undefined,
                name: '8989',
                original: 'new',
                modified: {
                    nested: {
                        level: 23
                    },
                    lojza: {
                        cat: {
                            dog: '123'
                        }
                    },
                    this: {
                        is: {
                            removed: undefined
                        }
                    }
                }
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).toHaveBeenCalledWith(SOURCE_ID, {
            cat: null,
            name: '8989',
            original: 'new',
            modified: {
                nested: {
                    level: 23
                },
                this: {
                    is: {
                        removed: null
                    }
                }
            }
        });
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalled();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('only endpoint is changed', async () => {
        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID
            },
            endpoint: {
                id: ENDPOINT_ID
            }
        });

        VALUES = {
            endpoint: {
                port: '2323'
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).toHaveBeenCalledWith(ENDPOINT_ID, {
            port: 2323,
            default: true,
            host: undefined,
            path: undefined,
            scheme: undefined,
            source_id: SOURCE_ID
        });
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('only endpoint is changed - port is nonsense', async () => {
        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID
            },
            endpoint: {
                id: ENDPOINT_ID
            }
        });

        VALUES = {
            endpoint: {
                port: 'ASDF'
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).toHaveBeenCalledWith(ENDPOINT_ID, {
            port: undefined,
            default: true,
            host: undefined,
            path: undefined,
            scheme: undefined,
            source_id: SOURCE_ID
        });
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('url is changed', async () => {
        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID
            },
            endpoint: {
                id: ENDPOINT_ID
            }
        });

        VALUES = {
            url: 'https://redhat.com:8989/mypage'
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).toHaveBeenCalledWith(ENDPOINT_ID, {
            port: 8989,
            default: true,
            host: 'redhat.com',
            path: '/mypage',
            scheme: 'https',
            source_id: SOURCE_ID
        });
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('only auth is changed', async () => {
        const AUTH_ID = '654789';

        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID
            },
            endpoint: {
                id: ENDPOINT_ID
            },
            authentication: {
                id: AUTH_ID
            }
        });

        VALUES = {
            authentication: {
                password: 'pepa'
            }
        };

        AUTHENTICATION_INIT = [{
            id: AUTH_ID
        }];

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).toHaveBeenCalledWith(AUTH_ID, VALUES.authentication);
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('only auth is changed and only modified (removed) values are sent to to the endpoint', async () => {
        const AUTH_ID = '654789';

        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID
            },
            endpoint: {
                id: ENDPOINT_ID
            },
            authentication: {
                id: AUTH_ID
            }
        });

        VALUES = {
            authentication: {
                password: 'pepa',
                user_name: 'lojza',
                removed: undefined
            }
        };

        AUTHENTICATION_INIT = [{
            id: AUTH_ID,
            password: 'pepa',
            removed: 'this was removed'
        }];

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).toHaveBeenCalledWith(AUTH_ID, {
            user_name: 'lojza',
            removed: null
        });
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('auth is created', async () => {
        FORM_API = prepareFormApi({
            source: {
                id: SOURCE_ID
            },
            endpoint: {
                id: ENDPOINT_ID
            }
        });

        VALUES = {
            authentication: {
                password: 'pepa'
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).toHaveBeenCalledWith({
            ...VALUES.authentication,
            resource_id: ENDPOINT_ID,
            resource_type: 'Endpoint'
        });
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('endpoint is created', async () => {
        VALUES = {
            url: 'https://redhat.com:8989/mypage'
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).toHaveBeenCalledWith({
            port: 8989,
            default: true,
            host: 'redhat.com',
            path: '/mypage',
            scheme: 'https',
            source_id: SOURCE_ID
        });
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('endpoint and auth is created', async () => {
        VALUES = {
            url: 'https://redhat.com:8989/mypage',
            authentication: {
                password: 'pepa'
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).toHaveBeenCalledWith({
            ...VALUES.authentication,
            resource_id: RETURNED_ENDPOINT.id,
            resource_type: 'Endpoint'
        });
        expect(endpointCreate).toHaveBeenCalledWith({
            port: 8989,
            default: true,
            host: 'redhat.com',
            path: '/mypage',
            scheme: 'https',
            source_id: SOURCE_ID
        });
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('auth is created, however there is no endpoint id and no endpoint values to create a new', async () => {
        VALUES = {
            authentication: {
                password: 'pepa'
            }
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).not.toHaveBeenCalled();
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).not.toHaveBeenCalled();
        expect(endpointCreate).not.toHaveBeenCalled();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('cost management is attached and values are updated', async () => {
        VALUES = {
            billing_source: { cluster: '12232' },
            credentials: { subscription_id: '28982id' },
            nonsense: 'Z7SHADZUSAgd'
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).toHaveBeenCalledWith({
            id: SOURCE_ID,
            billing_source: VALUES.billing_source,
            authentication: {
                credentials: VALUES.credentials
            }
        });
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).not.toHaveBeenCalledWith();
        expect(endpointCreate).not.toHaveBeenCalledWith();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('cost management is attached and values are updated - only billing_source', async () => {
        VALUES = {
            billing_source: { cluster: '12232' },
            nonsense: 'Z7SHADZUSAgd'
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).toHaveBeenCalledWith({
            id: SOURCE_ID,
            billing_source: VALUES.billing_source
        });
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).not.toHaveBeenCalledWith();
        expect(endpointCreate).not.toHaveBeenCalledWith();
        expect(appCreate).not.toHaveBeenCalled();
    });

    it('cost management is attached and values are updated - only credentials', async () => {
        VALUES = {
            credentials: { subscription_id: '28982id' },
            nonsense: 'Z7SHADZUSAgd'
        };

        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT);

        expect(mockPatchSourceSpy).toHaveBeenCalledWith({
            id: SOURCE_ID,
            authentication: {
                credentials: VALUES.credentials
            }
        });
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalledWith();
        expect(authCreate).not.toHaveBeenCalledWith();
        expect(endpointCreate).not.toHaveBeenCalledWith();
        expect(appCreate).not.toHaveBeenCalled();
    });
});

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

describe('removeEmpty', () => {
    it('removes empty nested objects', () => {
        expect(removeEmpty({
            source: {
                id: '1213'
            },
            name: undefined,
            authenticaion: {}
        })).toEqual({
            source: {
                id: '1213'
            }
        });
    });

    it('do not send authentication', () => {
        expect(removeEmpty({
            billing_source: { bucket: 'njmbnmbn' },
            application: { application_type_id: '2' },
            authentication: {}
        })).toEqual({
            billing_source: { bucket: 'njmbnmbn' },
            application: { application_type_id: '2' }
        });
    });
});
