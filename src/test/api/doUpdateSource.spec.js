import * as api from '../../api/entities';
import { doUpdateSource, parseUrl, urlOrHost } from '../../api/doUpdateSource';
import * as cmApi from '../../api/patchCmValues';

describe('doUpdateSource', () => {
    const HOST = 'mycluster.net';
    const PATH = '/path';
    const PORT = '1234';
    const SCHEME = 'https';

    const URL = `${SCHEME}://${HOST}:${PORT}${PATH}`;

    const EXPECTED_URL_OBJECT = {
        host: HOST,
        path: PATH,
        port: PORT,
        scheme: SCHEME
    };

    const SOURCE_ID = '1232312';
    const ENDPOINT_ID = '1323232';
    const SOURCE = {
        source: {
            id: SOURCE_ID
        },
        endpoints: [{
            id: ENDPOINT_ID
        }]
    };
    const ERROR_TITLES = {
        authentication: 'authentication error',
        source: 'source error',
        endpoint: 'endpoint error',
        costManagement: 'cost management error'
    };

    let FORM_DATA;

    let sourceSpy;
    let endpointSpy;
    let authenticationSpy;
    let patchCostManagementSpy;

    beforeEach(() => {
        sourceSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));
        endpointSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));
        authenticationSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));
        patchCostManagementSpy = jest.fn().mockImplementation(() => Promise.resolve('ok'));

        api.getSourcesApi = () => ({
            updateSource: sourceSpy,
            updateEndpoint: endpointSpy,
            updateAuthentication: authenticationSpy
        });
        cmApi.patchCmValues = patchCostManagementSpy;
    });

    afterEach(() => {
        sourceSpy.mockReset();
        endpointSpy.mockReset();
        authenticationSpy.mockReset();
        patchCostManagementSpy.mockReset();
    });

    it('sends nothing', () => {
        FORM_DATA = {};

        doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

        expect(sourceSpy).not.toHaveBeenCalled();
        expect(endpointSpy).not.toHaveBeenCalled();
        expect(authenticationSpy).not.toHaveBeenCalled();
        expect(patchCostManagementSpy).not.toHaveBeenCalled();
    });

    it('sends source values', () => {
        const SOURCE_VALUES = { name: 'pepa' };

        FORM_DATA = {
            source: SOURCE_VALUES
        };

        doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

        expect(sourceSpy).toHaveBeenCalledWith(SOURCE_ID, SOURCE_VALUES);
        expect(endpointSpy).not.toHaveBeenCalled();
        expect(authenticationSpy).not.toHaveBeenCalled();
        expect(patchCostManagementSpy).not.toHaveBeenCalled();
    });

    it('sends endpoint values', () => {
        const ENDPOINT_VALUES = { tenant: 'US-EAST' };

        FORM_DATA = {
            endpoint: ENDPOINT_VALUES
        };

        doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

        expect(sourceSpy).not.toHaveBeenCalled();
        expect(endpointSpy).toHaveBeenCalledWith(ENDPOINT_ID, ENDPOINT_VALUES);
        expect(authenticationSpy).not.toHaveBeenCalled();
        expect(patchCostManagementSpy).not.toHaveBeenCalled();
    });

    it('sends endpoint values with URL', () => {
        const ENDPOINT_VALUES = { tenant: 'US-EAST' };

        FORM_DATA = {
            url: URL,
            endpoint: ENDPOINT_VALUES
        };

        const EXPECTED_ENDPOINT_VALUES_WITH_URL = {
            ...ENDPOINT_VALUES,
            ...EXPECTED_URL_OBJECT,
            port: Number(PORT)
        };

        doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

        expect(sourceSpy).not.toHaveBeenCalled();
        expect(endpointSpy).toHaveBeenCalledWith(ENDPOINT_ID, EXPECTED_ENDPOINT_VALUES_WITH_URL);
        expect(authenticationSpy).not.toHaveBeenCalled();
        expect(patchCostManagementSpy).not.toHaveBeenCalled();
    });

    it('sends endpoint values only with URL', () => {
        FORM_DATA = {
            url: URL
        };

        const EXPECTED_ENDPOINT_VALUES_ONLY_WITH_URL = {
            ...EXPECTED_URL_OBJECT,
            port: Number(PORT)
        };

        doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

        expect(sourceSpy).not.toHaveBeenCalled();
        expect(endpointSpy).toHaveBeenCalledWith(ENDPOINT_ID, EXPECTED_ENDPOINT_VALUES_ONLY_WITH_URL);
        expect(authenticationSpy).not.toHaveBeenCalled();
        expect(patchCostManagementSpy).not.toHaveBeenCalled();
    });

    it('sends authentication values', () => {
        const AUTH_ID = '1234234243';
        const AUTHENTICATION_VALUES = { password: '123456' };

        FORM_DATA = {
            authentications: { [`a${AUTH_ID}`]: AUTHENTICATION_VALUES }
        };

        doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

        expect(sourceSpy).not.toHaveBeenCalled();
        expect(endpointSpy).not.toHaveBeenCalled();
        expect(authenticationSpy).toHaveBeenCalledWith(AUTH_ID, AUTHENTICATION_VALUES);
        expect(patchCostManagementSpy).not.toHaveBeenCalled();
    });

    it('sends multiple authentication values', () => {
        const AUTH_ID = '1234234243';
        const AUTH_ID_2 = '7232490239';
        const AUTHENTICATION_VALUES = { password: '123456' };
        const AUTHENTICATION_VALUES_2 = { usernamen: 'QWERTY' };

        FORM_DATA = {
            authentications: {
                [`a${AUTH_ID}`]: AUTHENTICATION_VALUES,
                [`a${AUTH_ID_2}`]: AUTHENTICATION_VALUES_2
            }
        };

        doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

        expect(sourceSpy).not.toHaveBeenCalled();
        expect(endpointSpy).not.toHaveBeenCalled();
        expect(patchCostManagementSpy).not.toHaveBeenCalled();

        expect(authenticationSpy.mock.calls.length).toEqual(Object.keys(FORM_DATA.authentications).length);

        expect(authenticationSpy.mock.calls[0][0]).toBe(AUTH_ID);
        expect(authenticationSpy.mock.calls[0][1]).toBe(AUTHENTICATION_VALUES);

        expect(authenticationSpy.mock.calls[1][0]).toBe(AUTH_ID_2);
        expect(authenticationSpy.mock.calls[1][1]).toBe(AUTHENTICATION_VALUES_2);
    });

    describe('cost management endpoint', () => {
        const BILLING_SOURCE_VALUES = { bucket: '123456' };
        const CREDENTIALS_VALUES = { subscription_id: '123456' };

        it('sends billing_source values', () => {
            FORM_DATA = {
                billing_source: BILLING_SOURCE_VALUES
            };

            const EXPECTED_CM_DATA = { ...FORM_DATA };

            doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

            expect(sourceSpy).not.toHaveBeenCalled();
            expect(endpointSpy).not.toHaveBeenCalled();
            expect(authenticationSpy).not.toHaveBeenCalled();
            expect(patchCostManagementSpy).toHaveBeenCalledWith(SOURCE_ID, EXPECTED_CM_DATA);
        });

        it('sends credentials values', () => {
            FORM_DATA = {
                credentials: CREDENTIALS_VALUES
            };

            const EXPECTED_CM_DATA = { ...FORM_DATA };

            doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

            expect(sourceSpy).not.toHaveBeenCalled();
            expect(endpointSpy).not.toHaveBeenCalled();
            expect(authenticationSpy).not.toHaveBeenCalled();
            expect(patchCostManagementSpy).toHaveBeenCalledWith(SOURCE_ID, EXPECTED_CM_DATA);
        });

        it('sends credentials + billing_source values', () => {
            FORM_DATA = {
                billing_source: BILLING_SOURCE_VALUES,
                credentials: CREDENTIALS_VALUES
            };

            const EXPECTED_CM_DATA = { ...FORM_DATA };

            doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);

            expect(sourceSpy).not.toHaveBeenCalled();
            expect(endpointSpy).not.toHaveBeenCalled();
            expect(authenticationSpy).not.toHaveBeenCalled();
            expect(patchCostManagementSpy).toHaveBeenCalledWith(SOURCE_ID, EXPECTED_CM_DATA);
        });

    });

    describe('failures', () => {
        const ERROR_TEXT = 'some error text';
        const ERROR_OBJECT = {
            errors: [{
                detail: ERROR_TEXT
            }]
        };

        it('handle source failure', async () => {
            sourceSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR_OBJECT));

            const EXPECTED_ERROR = { error: {
                detail: ERROR_TEXT,
                title: ERROR_TITLES.source
            } };

            const SOURCE_VALUES = { name: 'pepa' };

            FORM_DATA = {
                source: SOURCE_VALUES
            };

            try {
                await doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);
                throw ('should not be here');
            } catch (error) {
                expect(error).toEqual(EXPECTED_ERROR);
            }
        });

        it('handle endpoint failure', async () => {
            endpointSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR_OBJECT));

            const EXPECTED_ERROR = { error: {
                detail: ERROR_TEXT,
                title: ERROR_TITLES.endpoint
            } };

            const ENDPOINT_VALUES = { tenant: 'US-EAST' };

            FORM_DATA = {
                endpoint: ENDPOINT_VALUES
            };

            try {
                await doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);
                throw ('should not be here');
            } catch (error) {
                expect(error).toEqual(EXPECTED_ERROR);
            }
        });

        it('handle authentication failure', async () => {
            authenticationSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR_OBJECT));

            const EXPECTED_ERROR = { error: {
                detail: ERROR_TEXT,
                title: ERROR_TITLES.authentication
            } };

            const AUTH_ID = '1234234243';
            const AUTHENTICATION_VALUES = { password: '123456' };

            FORM_DATA = {
                authentications: { [`a${AUTH_ID}`]: AUTHENTICATION_VALUES }
            };

            try {
                await doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);
                throw ('should not be here');
            } catch (error) {
                expect(error).toEqual(EXPECTED_ERROR);
            }
        });

        it('handle CM failure', async () => {
            cmApi.patchCmValues = jest.fn().mockImplementation(() => Promise.reject(ERROR_OBJECT));

            const EXPECTED_ERROR = { error: {
                detail: ERROR_TEXT,
                title: ERROR_TITLES.costManagement
            } };

            FORM_DATA = {
                billing_source: { bucket: 'aaa' }
            };

            try {
                await doUpdateSource(SOURCE, FORM_DATA, ERROR_TITLES);
                throw ('should not be here');
            } catch (error) {
                expect(error).toEqual(EXPECTED_ERROR);
            }
        });
    });

    describe('helpers', () => {
        const EMPTY_OBJECT = {};

        describe('parseUrl', () => {
            it('parses URL', () => {
                expect(parseUrl(URL)).toEqual(EXPECTED_URL_OBJECT);
            });

            it('parses URL with empty port', () => {
                const URL_EMPTY_PORT = `${SCHEME}://${HOST}${PATH}`;

                const EXPECTED_URL_OBJECT_EMPTY_PORT = {
                    ...EXPECTED_URL_OBJECT,
                    port: '443'
                };

                expect(parseUrl(URL_EMPTY_PORT)).toEqual(EXPECTED_URL_OBJECT_EMPTY_PORT);
            });

            it('parses undefined', () => {
                expect(parseUrl(undefined)).toEqual(EMPTY_OBJECT);
            });

            it('throw empty object on error', () => {
                const WRONG_URL = `://${HOST}${SCHEME}:${PORT}${PATH}`;

                expect(parseUrl(WRONG_URL)).toEqual(EMPTY_OBJECT);
            });
        });

        describe('urlOrHost', () => {
            it('returns form data', () => {
                const FORM_DATA_WITHOUT_URL = {
                    port: '1234',
                    scheme: 'https'
                };

                expect(urlOrHost(FORM_DATA_WITHOUT_URL)).toEqual(FORM_DATA_WITHOUT_URL);
            });

            it('returns parsed url', () => {
                expect(urlOrHost({ url: URL })).toEqual(EXPECTED_URL_OBJECT);
            });
        });
    });
});
