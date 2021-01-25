import { doAttachApp, removeEmpty } from '../../api/doAttachApp';
import * as api from '../../api/entities';
import * as appStatus from '@redhat-cloud-services/frontend-components-sources/cjs/getApplicationStatus';

const prepareFormApi = (values) => ({
  getState: () => ({
    values,
  }),
});

jest.mock('@redhat-cloud-services/frontend-components-sources/cjs/constants', () => ({
  __esModule: true,
  timeoutedApps: () => [],
}));

describe('doAttachApp', () => {
  let sourceUpdate;
  let authUpdate;
  let endpointUpdate;

  let authCreate;
  let endpointCreate;

  let appCreate;
  let createAuthApp;

  let appDelete;

  let VALUES;
  let FORM_API;
  let AUTHENTICATION_INIT;
  let SOURCE_ID;
  let APP_ID;
  let ENDPOINT_ID;
  let RETURNED_ENDPOINT;
  let INITIAL_VALUES;
  let RETURNED_AUTH;
  let RETURNED_APP;
  let AUTH_ID;

  let mockAppStatus;

  let consoleError;

  beforeEach(() => {
    consoleError = console.error;
    console.error = jest.fn();

    ENDPOINT_ID = '99998887776655';
    AUTH_ID = '55643265870983219274209';
    APP_ID = '878776767';

    mockAppStatus = jest
      .spyOn(appStatus, 'checkAppAvailability')
      .mockImplementation(() => Promise.resolve({ status: 'available', id: APP_ID }));

    jest.resetModules();

    RETURNED_ENDPOINT = { id: ENDPOINT_ID };
    RETURNED_AUTH = { id: AUTH_ID };
    RETURNED_APP = { id: APP_ID };

    sourceUpdate = jest.fn().mockImplementation(() => Promise.resolve('ok'));
    authUpdate = jest.fn().mockImplementation(() => Promise.resolve(RETURNED_AUTH));
    endpointUpdate = jest.fn().mockImplementation(() => Promise.resolve(RETURNED_ENDPOINT));
    authCreate = jest.fn().mockImplementation(() => Promise.resolve(RETURNED_AUTH));
    endpointCreate = jest.fn().mockImplementation(() => Promise.resolve(RETURNED_ENDPOINT));
    createAuthApp = jest.fn().mockImplementation(() => Promise.resolve('ok'));
    appDelete = jest.fn().mockImplementation(() => Promise.resolve('ok'));

    api.getSourcesApi = () => ({
      updateSource: sourceUpdate,
      updateEndpoint: endpointUpdate,
      updateAuthentication: authUpdate,

      createEndpoint: endpointCreate,
      createAuthentication: authCreate,
      createAuthApp,

      deleteApplication: appDelete,
    });

    appCreate = jest.fn().mockImplementation(() => Promise.resolve(RETURNED_APP));

    api.doCreateApplication = appCreate;

    SOURCE_ID = '23278326';
    VALUES = {};
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
    };
    FORM_API = prepareFormApi(INITIAL_VALUES);
    AUTHENTICATION_INIT = [];
  });

  afterEach(() => {
    console.erorr = consoleError;
    mockAppStatus.mockReset();
  });

  it('no values at all - should miss source id (only developer error)', async () => {
    expect.assertions(10);

    FORM_API = prepareFormApi({});

    try {
      await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);
    } catch (error) {
      expect(error).toEqual('Missing source id');

      expect(sourceUpdate).not.toHaveBeenCalled();
      expect(authUpdate).not.toHaveBeenCalled();
      expect(endpointUpdate).not.toHaveBeenCalled();
      expect(authCreate).not.toHaveBeenCalled();
      expect(endpointCreate).not.toHaveBeenCalled();
      expect(appCreate).not.toHaveBeenCalled();
      expect(createAuthApp).not.toHaveBeenCalled();
      expect(mockAppStatus).not.toHaveBeenCalled();
      expect(appDelete).not.toHaveBeenCalled();
    }
  });

  it('only app is changed', async () => {
    VALUES = {
      application: {
        application_type_id: APP_ID,
      },
    };

    const result = await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalled();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).toHaveBeenCalledWith({ source_id: SOURCE_ID, application_type_id: APP_ID });
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(APP_ID, 0);
    expect(appDelete).not.toHaveBeenCalled();

    expect(result).toEqual({ id: APP_ID, applications: [{ id: APP_ID, status: 'available' }] });
  });

  it('only app with extra changed', async () => {
    const EXTRA = { billing_source: 'billing-source' };

    VALUES = {
      application: {
        application_type_id: APP_ID,
        extra: EXTRA,
      },
    };

    const result = await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalled();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).toHaveBeenCalledWith({ source_id: SOURCE_ID, application_type_id: APP_ID, extra: EXTRA });
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(APP_ID, 0);
    expect(appDelete).not.toHaveBeenCalled();

    expect(result).toEqual({ id: APP_ID, applications: [{ id: APP_ID, status: 'available' }] });
  });

  it('only source is changed', async () => {
    VALUES = {
      source: {
        source_ref: '2323',
      },
    };

    const result = await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).toHaveBeenCalledWith(SOURCE_ID, {
      source_ref: '2323',
    });
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalled();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).not.toHaveBeenCalled();
    expect(appDelete).not.toHaveBeenCalled();

    expect(result).toEqual({});
  });

  it('only source is changed and only modified (removed) values are sent to the endpoint', async () => {
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
        source_ref: '2323',
        cat: 'dog',
        original: 'old',
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      source: {
        source_ref: '2323',
        cat: null,
        name: '8989',
        original: 'new',
        emptyValue: undefined,
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).toHaveBeenCalledWith(SOURCE_ID, {
      cat: null,
      name: '8989',
      original: 'new',
    });
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalled();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).not.toHaveBeenCalled();
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('only source is changed and only modified (removed) values are sent to the endpoint with super nesting', async () => {
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
        source_ref: '2323',
        cat: 'dog',
        original: 'old',
        modified: {
          lojza: {
            cat: {
              dog: '123',
            },
          },
          this: {
            is: {
              removed: 'mokry pes',
            },
          },
        },
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      source: {
        source_ref: '2323',
        cat: null,
        name: '8989',
        original: 'new',
        modified: {
          nested: {
            level: 23,
          },
          lojza: {
            cat: {
              dog: '123',
            },
          },
          this: {
            is: {
              removed: null,
            },
          },
        },
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).toHaveBeenCalledWith(SOURCE_ID, {
      cat: null,
      name: '8989',
      original: 'new',
      modified: {
        nested: {
          level: 23,
        },
        this: {
          is: {
            removed: null,
          },
        },
      },
    });
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalled();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).not.toHaveBeenCalled();
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('only endpoint is changed', async () => {
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
      endpoint: {
        id: ENDPOINT_ID,
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      endpoint: {
        port: '2323',
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).toHaveBeenCalledWith(ENDPOINT_ID, {
      port: 2323,
      host: undefined,
      path: undefined,
      scheme: undefined,
    });
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(ENDPOINT_ID, undefined, undefined, 'getEndpoint', expect.any(Date));
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('only endpoint is changed - port is nonsense', async () => {
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
      endpoint: {
        id: ENDPOINT_ID,
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      endpoint: {
        port: 'ASDF',
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).toHaveBeenCalledWith(ENDPOINT_ID, {
      port: undefined,
      host: undefined,
      path: undefined,
      scheme: undefined,
    });
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(ENDPOINT_ID, undefined, undefined, 'getEndpoint', expect.any(Date));
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('empty endpoint', async () => {
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
      endpoint: {
        id: ENDPOINT_ID,
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      endpoint: {},
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalled();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(ENDPOINT_ID, undefined, undefined, 'getEndpoint', expect.any(Date));
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('url is changed', async () => {
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
      endpoint: {
        id: ENDPOINT_ID,
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      url: 'https://redhat.com:8989/mypage',
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).toHaveBeenCalledWith(ENDPOINT_ID, {
      port: 8989,
      host: 'redhat.com',
      path: '/mypage',
      scheme: 'https',
    });
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(ENDPOINT_ID, undefined, undefined, 'getEndpoint', expect.any(Date));
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('only auth is changed', async () => {
    const AUTH_ID = '654789';

    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
      endpoint: {
        id: ENDPOINT_ID,
      },
      authentication: {
        id: AUTH_ID,
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      authentication: {
        password: 'pepa',
      },
    };

    AUTHENTICATION_INIT = [
      {
        id: AUTH_ID,
      },
    ];

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).toHaveBeenCalledWith(AUTH_ID, VALUES.authentication);
    expect(endpointUpdate).not.toHaveBeenCalledWith();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(ENDPOINT_ID, undefined, undefined, 'getEndpoint', expect.any(Date));
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('only auth is changed and only modified (removed) values are sent to to the endpoint', async () => {
    const AUTH_ID = '654789';

    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
      endpoint: {
        id: ENDPOINT_ID,
      },
      authentication: {
        id: AUTH_ID,
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      authentication: {
        password: 'pepa',
        user_name: 'lojza',
        removed: null,
      },
    };

    AUTHENTICATION_INIT = [
      {
        id: AUTH_ID,
        password: 'pepa',
        removed: 'this was removed',
      },
    ];

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).toHaveBeenCalledWith(AUTH_ID, {
      user_name: 'lojza',
      removed: null,
    });
    expect(endpointUpdate).not.toHaveBeenCalledWith();
    expect(authCreate).not.toHaveBeenCalled();
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(ENDPOINT_ID, undefined, undefined, 'getEndpoint', expect.any(Date));
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('auth is created', async () => {
    INITIAL_VALUES = {
      source: {
        id: SOURCE_ID,
      },
      endpoint: {
        id: ENDPOINT_ID,
      },
    };

    FORM_API = prepareFormApi(INITIAL_VALUES);

    VALUES = {
      authentication: {
        password: 'pepa',
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalledWith();
    expect(authCreate).toHaveBeenCalledWith({
      ...VALUES.authentication,
      resource_id: undefined, // no endpoint values
      resource_type: 'Application',
      source_id: SOURCE_ID,
    });
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).toHaveBeenCalledWith(ENDPOINT_ID, undefined, undefined, 'getEndpoint', expect.any(Date));
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('endpoint is created', async () => {
    VALUES = {
      url: 'https://redhat.com:8989/mypage',
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

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
      source_id: SOURCE_ID,
    });
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).not.toHaveBeenCalled();
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('endpoint and auth is created', async () => {
    VALUES = {
      url: 'https://redhat.com:8989/mypage',
      authentication: {
        password: 'pepa',
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalledWith();
    expect(authCreate).toHaveBeenCalledWith({
      ...VALUES.authentication,
      resource_id: RETURNED_ENDPOINT.id,
      resource_type: 'Endpoint',
      source_id: SOURCE_ID,
    });
    expect(endpointCreate).toHaveBeenCalledWith({
      port: 8989,
      default: true,
      host: 'redhat.com',
      path: '/mypage',
      scheme: 'https',
      source_id: SOURCE_ID,
    });
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).not.toHaveBeenCalled();
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('auth is created, however there is no endpoint id and no endpoint values to create a new', async () => {
    VALUES = {
      authentication: {
        password: 'pepa',
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalledWith();
    expect(authCreate).toHaveBeenCalledWith({
      ...VALUES.authentication,
      resource_id: undefined, // empty endpoint values
      resource_type: 'Application',
      source_id: SOURCE_ID,
    });
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).not.toHaveBeenCalled();
    expect(createAuthApp).not.toHaveBeenCalled();
    expect(mockAppStatus).not.toHaveBeenCalled();
    expect(appDelete).not.toHaveBeenCalled();
  });

  it('auth and app is created', async () => {
    VALUES = {
      authentication: {
        password: 'pepa',
      },
      application: {
        application_type_id: APP_ID,
      },
    };

    await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

    expect(sourceUpdate).not.toHaveBeenCalled();
    expect(authUpdate).not.toHaveBeenCalled();
    expect(endpointUpdate).not.toHaveBeenCalledWith();
    expect(authCreate).toHaveBeenCalledWith({
      ...VALUES.authentication,
      resource_id: RETURNED_APP.id,
      resource_type: 'Application',
      source_id: SOURCE_ID,
    });
    expect(endpointCreate).not.toHaveBeenCalled();
    expect(appCreate).toHaveBeenCalledWith({ source_id: SOURCE_ID, application_type_id: APP_ID });
    expect(createAuthApp).toHaveBeenCalledWith({
      authentication_id: AUTH_ID,
      application_id: APP_ID,
    });
    expect(mockAppStatus).toHaveBeenCalledWith(APP_ID, 0);
    expect(appDelete).not.toHaveBeenCalled();
  });

  describe('appAuth endpoint', () => {
    it('new auth', async () => {
      VALUES = {
        application: {
          application_type_id: APP_ID,
        },
        url: 'https://redhat.com:8989/mypage',
        authentication: {
          password: 'pepa',
        },
      };

      await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

      expect(sourceUpdate).not.toHaveBeenCalled();
      expect(authUpdate).not.toHaveBeenCalled();
      expect(endpointUpdate).not.toHaveBeenCalled();
      expect(authCreate).toHaveBeenCalled();
      expect(endpointCreate).toHaveBeenCalled();
      expect(appCreate).toHaveBeenCalledWith({ source_id: SOURCE_ID, application_type_id: APP_ID });
      expect(createAuthApp).toHaveBeenCalledWith({
        authentication_id: AUTH_ID,
        application_id: APP_ID,
      });
      expect(mockAppStatus).toHaveBeenCalledWith(APP_ID, 0);
      expect(appDelete).not.toHaveBeenCalled();
    });

    it('new auth - error, app is removed', async () => {
      expect.assertions(9);

      createAuthApp = jest.fn().mockImplementation(() => Promise.reject('error'));

      api.getSourcesApi = () => ({
        updateSource: sourceUpdate,
        updateEndpoint: endpointUpdate,
        updateAuthentication: authUpdate,

        createEndpoint: endpointCreate,
        createAuthentication: authCreate,
        createAuthApp,

        deleteApplication: appDelete,
      });

      VALUES = {
        application: {
          application_type_id: APP_ID,
        },
        url: 'https://redhat.com:8989/mypage',
        authentication: {
          password: 'pepa',
        },
      };

      try {
        await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);
      } catch {
        expect(sourceUpdate).not.toHaveBeenCalled();
        expect(authUpdate).not.toHaveBeenCalled();
        expect(endpointUpdate).not.toHaveBeenCalled();
        expect(authCreate).toHaveBeenCalled();
        expect(endpointCreate).toHaveBeenCalled();
        expect(appCreate).toHaveBeenCalledWith({ source_id: SOURCE_ID, application_type_id: APP_ID });
        expect(createAuthApp).toHaveBeenCalledWith({
          authentication_id: AUTH_ID,
          application_id: APP_ID,
        });
        expect(mockAppStatus).not.toHaveBeenCalled();
        expect(appDelete).toHaveBeenCalledWith(APP_ID);
      }
    });

    it('current auth', async () => {
      const AUTH_ID = '654789';

      INITIAL_VALUES = {
        source: {
          id: SOURCE_ID,
        },
        endpoint: {
          id: ENDPOINT_ID,
        },
        authentication: {
          id: AUTH_ID,
        },
      };

      FORM_API = prepareFormApi(INITIAL_VALUES);

      VALUES = {
        authentication: {
          password: 'pepa',
        },
        application: {
          application_type_id: APP_ID,
        },
      };

      AUTHENTICATION_INIT = [
        {
          id: AUTH_ID,
        },
      ];

      await doAttachApp(VALUES, FORM_API, AUTHENTICATION_INIT, INITIAL_VALUES);

      expect(sourceUpdate).not.toHaveBeenCalled();
      expect(authUpdate).toHaveBeenCalled();
      expect(endpointUpdate).not.toHaveBeenCalled();
      expect(authCreate).not.toHaveBeenCalled();
      expect(endpointCreate).not.toHaveBeenCalled();
      expect(appCreate).toHaveBeenCalledWith({ source_id: SOURCE_ID, application_type_id: APP_ID });
      expect(createAuthApp).toHaveBeenCalledWith({
        authentication_id: AUTH_ID,
        application_id: APP_ID,
      });
      expect(mockAppStatus).toHaveBeenCalledWith(APP_ID, 0);
      expect(appDelete).not.toHaveBeenCalled();
    });
  });
});

describe('removeEmpty', () => {
  it('removes empty nested objects', () => {
    expect(
      removeEmpty({
        source: {
          id: '1213',
        },
        name: undefined,
        authenticaion: {},
      })
    ).toEqual({
      source: {
        id: '1213',
      },
    });
  });

  it('do not send authentication', () => {
    expect(
      removeEmpty({
        billing_source: { bucket: 'njmbnmbn' },
        application: { application_type_id: '2' },
        authentication: {},
      })
    ).toEqual({
      billing_source: { bucket: 'njmbnmbn' },
      application: { application_type_id: '2' },
    });
  });
});
