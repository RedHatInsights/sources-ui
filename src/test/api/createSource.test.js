import { doCreateSource, parseUrl, urlOrHost } from '../../api/createSource';
import { OPENSHIFT_TYPE } from '../addSourceWizard/helpers/sourceTypes';
import applicationTypes, { COST_MANAGEMENT_APP } from '../addSourceWizard/helpers/applicationTypes';

import * as api from '../../api/entities';
import * as errorHandling from '../../api/handleError';
import * as checkApp from '../../api/getApplicationStatus';
import * as checkSourceStatus from '../../api/checkSourceStatus';
import { NO_APPLICATION_VALUE } from '../../components/addSourceWizard/stringConstants';
import { COST_MANAGEMENT_APP_NAME } from '../../utilities/constants';
import emptyAuthType from '../../components/addSourceWizard/emptyAuthType';

describe('doCreateSource', () => {
  const HOST = 'mycluster.net';
  const PATH = '/path';
  const PORT = '1234';
  const SCHEME = 'https';

  const URL = `${SCHEME}://${HOST}:${PORT}${PATH}`;

  const EXPECTED_URL_OBJECT = {
    host: HOST,
    path: PATH,
    port: PORT,
    scheme: SCHEME,
  };

  describe('source creation api', () => {
    let TYPE_NAME;
    let SOURCE_NAME;

    let FORM_DATA;
    let SOURCE_FORM_DATA;
    let AUTHENTICATION_FORM_DATA;
    let ENDPOINT_FORM_DATA;
    let APPLICATION_FORM_DATA;

    let INITIAL_VALUES;

    let CREATED_SOURCE_ID;
    let CREATE_SOURCE_DATA_OUT;

    let CREATED_EDNPOINT_ID;
    let CREATED_APP_ID;
    let CREATED_AUTH_ID;

    let bulkCreate;
    let checkAppMock;
    let mocks;

    beforeEach(() => {
      TYPE_NAME = OPENSHIFT_TYPE.name;
      SOURCE_NAME = 'some name';

      FORM_DATA = { source_type: TYPE_NAME };
      SOURCE_FORM_DATA = {
        name: SOURCE_NAME,
      };
      AUTHENTICATION_FORM_DATA = {
        password: '123455',
      };
      ENDPOINT_FORM_DATA = { url: 'https//' };
      APPLICATION_FORM_DATA = { collect_info: true };

      INITIAL_VALUES = {
        ...FORM_DATA,
        source: SOURCE_FORM_DATA,
        authentication: AUTHENTICATION_FORM_DATA,
        endpoint: ENDPOINT_FORM_DATA,
      };

      CREATED_SOURCE_ID = '12349876';
      CREATE_SOURCE_DATA_OUT = { sources: [{ id: CREATED_SOURCE_ID }] };

      CREATED_EDNPOINT_ID = 'endpoint-id';
      CREATED_APP_ID = 'app-id';
      CREATED_AUTH_ID = 'auth-id';

      bulkCreate = jest.fn().mockImplementation((data) =>
        Promise.resolve({
          ...CREATE_SOURCE_DATA_OUT,
          ...(data.endpoints.length > 0 && { endpoints: [{ id: CREATED_EDNPOINT_ID }] }),
          ...(data.applications.length > 0 && { applications: [{ id: CREATED_APP_ID }] }),
          ...(data.authentications.length > 0 && { authentications: [{ id: CREATED_AUTH_ID }] }),
        })
      );

      mocks = {
        bulkCreate,
      };

      api.getSourcesApi = () => mocks;

      checkSourceStatus.default = jest.fn();

      checkAppMock = jest
        .fn()
        .mockImplementation((id, timeout, delay, entity) =>
          entity === 'getEndpoint' ? Promise.resolve({ id: CREATED_EDNPOINT_ID }) : Promise.resolve({ id: CREATED_APP_ID })
        );
      checkApp.checkAppAvailability = checkAppMock;
    });

    it('create source with no app', async () => {
      const FORM_DATA = {
        ...INITIAL_VALUES,
      };

      const result = await doCreateSource(FORM_DATA);

      expect(result).toEqual({ applications: [], endpoint: [{ id: CREATED_EDNPOINT_ID }], id: CREATED_SOURCE_ID });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [],
        authentications: [{ password: '123455', resource_type: 'endpoint', resource_name: undefined }],
        endpoints: [
          {
            default: true,
            host: undefined,
            path: undefined,
            port: undefined,
            scheme: undefined,
            source_name: 'some name',
            url: 'https//',
          },
        ],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_EDNPOINT_ID, undefined, undefined, 'getEndpoint');
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('create source with no app - ignore NO_APPLICATION_VALUE', async () => {
      const FORM_DATA = {
        ...INITIAL_VALUES,
        application: { application_type_id: NO_APPLICATION_VALUE },
      };

      const result = await doCreateSource(FORM_DATA);

      expect(result).toEqual({ applications: [], endpoint: [{ id: CREATED_EDNPOINT_ID }], id: CREATED_SOURCE_ID });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [],
        authentications: [{ password: '123455', resource_type: 'endpoint', resource_name: undefined }],
        endpoints: [
          {
            default: true,
            host: undefined,
            path: undefined,
            port: undefined,
            scheme: undefined,
            source_name: 'some name',
            url: 'https//',
          },
        ],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_EDNPOINT_ID, undefined, undefined, 'getEndpoint');
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('create source with noEndpoint set', async () => {
      const FORM_DATA = {
        ...INITIAL_VALUES,
        endpoint: undefined,
      };

      const result = await doCreateSource(FORM_DATA);

      expect(result).toEqual({ applications: [], endpoint: [], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [],
        authentications: [{ password: '123455', resource_type: 'source', resource_name: 'some name' }],
        endpoints: [],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).not.toHaveBeenCalled();
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('create source with url', async () => {
      const FORM_DATA = {
        ...INITIAL_VALUES,
        url: URL,
      };

      const result = await doCreateSource(FORM_DATA);

      expect(result).toEqual({ applications: [], endpoint: [{ id: 'endpoint-id' }], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [],
        authentications: [{ password: '123455', resource_type: 'endpoint', resource_name: HOST }],
        endpoints: [
          {
            default: true,
            host: 'mycluster.net',
            path: '/path',
            port: 1234,
            scheme: 'https',
            source_name: 'some name',
            url: 'https//',
          },
        ],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_EDNPOINT_ID, undefined, undefined, 'getEndpoint');
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('create source with app', async () => {
      const APP_ID = COST_MANAGEMENT_APP.id;

      const FORM_DATA = {
        ...INITIAL_VALUES,
        application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
      };

      const result = await doCreateSource(FORM_DATA);

      expect(result).toEqual({ applications: [{ id: 'app-id' }], endpoint: [{ id: 'endpoint-id' }], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [{ application_type_id: '2', collect_info: true, source_name: 'some name' }],
        authentications: [{ password: '123455', resource_type: 'endpoint', source_name: undefined }],
        endpoints: [
          {
            default: true,
            host: undefined,
            path: undefined,
            port: undefined,
            scheme: undefined,
            source_name: 'some name',
            url: 'https//',
          },
        ],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_APP_ID, 0);
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('create source with app and URL', async () => {
      const APP_ID = COST_MANAGEMENT_APP.id;

      const FORM_DATA = {
        ...INITIAL_VALUES,
        endpoint: undefined,
        url: URL,
        application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
      };

      const result = await doCreateSource(FORM_DATA);

      expect(result).toEqual({ applications: [{ id: 'app-id' }], endpoint: [{ id: 'endpoint-id' }], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [{ application_type_id: '2', collect_info: true, source_name: 'some name' }],
        authentications: [{ password: '123455', resource_type: 'endpoint', resource_name: HOST }],
        endpoints: [
          {
            default: true,
            host: HOST,
            path: PATH,
            port: Number(PORT),
            scheme: SCHEME,
            source_name: 'some name',
          },
        ],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_APP_ID, 0);
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('create source with app with timeout', async () => {
      const APP_ID = COST_MANAGEMENT_APP.id;

      const FORM_DATA = {
        ...INITIAL_VALUES,
        application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
      };

      const timeoutedApps = [COST_MANAGEMENT_APP.id];

      bulkCreate = jest.fn().mockImplementation((data) =>
        Promise.resolve({
          ...CREATE_SOURCE_DATA_OUT,
          ...(data.endpoints.length > 0 && { endpoints: [{ id: CREATED_EDNPOINT_ID }] }),
          ...(data.applications.length > 0 && {
            applications: [{ id: CREATED_APP_ID, application_type_id: COST_MANAGEMENT_APP.id }],
          }),
          ...(data.authentications.length > 0 && { authentications: [{ id: CREATED_AUTH_ID }] }),
        })
      );

      mocks = {
        bulkCreate,
      };

      api.getSourcesApi = () => mocks;

      const result = await doCreateSource(FORM_DATA, timeoutedApps);

      expect(result).toEqual({ applications: [{ id: 'app-id' }], endpoint: [{ id: 'endpoint-id' }], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [{ application_type_id: '2', collect_info: true, source_name: 'some name' }],
        authentications: [{ password: '123455', resource_type: 'endpoint', resource_name: undefined }],
        endpoints: [
          {
            default: true,
            host: undefined,
            path: undefined,
            port: undefined,
            scheme: undefined,
            source_name: 'some name',
            url: 'https//',
          },
        ],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
      expect(checkAppMock.mock.calls[0][0]).toEqual(CREATED_APP_ID);
      expect(checkAppMock.mock.calls[0][1]).toEqual(10000);
      expect(checkAppMock.mock.calls[1][0]).toEqual(CREATED_EDNPOINT_ID);
    });

    it('create source with app and no endpoint set', async () => {
      const APP_ID = COST_MANAGEMENT_APP.id;

      const FORM_DATA = {
        ...INITIAL_VALUES,
        application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
        endpoint: undefined,
        authentication: undefined,
      };

      const result = await doCreateSource(FORM_DATA);

      expect(result).toEqual({ applications: [{ id: 'app-id' }], endpoint: [], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [{ application_type_id: '2', collect_info: true, source_name: 'some name' }],
        authentications: [],
        endpoints: [],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_APP_ID, 0);
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('create source with app, auth and no endpoint set', async () => {
      const APP_ID = COST_MANAGEMENT_APP.id;

      const FORM_DATA = {
        ...INITIAL_VALUES,
        application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
        endpoint: undefined,
        authentication: AUTHENTICATION_FORM_DATA,
      };

      bulkCreate = jest.fn().mockImplementation((data) =>
        Promise.resolve({
          ...CREATE_SOURCE_DATA_OUT,
          ...(data.endpoints.length > 0 && { endpoints: [{ id: CREATED_EDNPOINT_ID }] }),
          ...(data.applications.length > 0 && {
            applications: [{ id: CREATED_APP_ID, application_type_id: COST_MANAGEMENT_APP.id }],
          }),
          ...(data.authentications.length > 0 && { authentications: [{ id: CREATED_AUTH_ID }] }),
        })
      );

      mocks = {
        bulkCreate,
      };

      api.getSourcesApi = () => mocks;

      const result = await doCreateSource(FORM_DATA, [], applicationTypes);

      expect(result).toEqual({ applications: [{ id: 'app-id' }], endpoint: [], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [{ application_type_id: '2', collect_info: true, source_name: 'some name' }],
        authentications: [{ password: '123455', resource_type: 'application', resource_name: COST_MANAGEMENT_APP_NAME }],
        endpoints: [],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_APP_ID, 0);
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    it('ignore empty auth type', async () => {
      const APP_ID = COST_MANAGEMENT_APP.id;

      const FORM_DATA = {
        ...INITIAL_VALUES,
        application: { ...APPLICATION_FORM_DATA, application_type_id: APP_ID },
        endpoint: undefined,
        authentication: { ...AUTHENTICATION_FORM_DATA, authtype: emptyAuthType.type },
      };

      bulkCreate = jest.fn().mockImplementation((data) =>
        Promise.resolve({
          ...CREATE_SOURCE_DATA_OUT,
          ...(data.endpoints.length > 0 && { endpoints: [{ id: CREATED_EDNPOINT_ID }] }),
          ...(data.applications.length > 0 && {
            applications: [{ id: CREATED_APP_ID, application_type_id: COST_MANAGEMENT_APP.id }],
          }),
          ...(data.authentications.length > 0 && { authentications: [{ id: CREATED_AUTH_ID }] }),
        })
      );

      mocks = {
        bulkCreate,
      };

      api.getSourcesApi = () => mocks;

      const result = await doCreateSource(FORM_DATA, [], applicationTypes);

      expect(result).toEqual({ applications: [{ id: 'app-id' }], endpoint: [], id: '12349876' });

      expect(bulkCreate).toHaveBeenCalledWith({
        applications: [{ application_type_id: '2', collect_info: true, source_name: 'some name' }],
        authentications: [],
        endpoints: [],
        sources: [{ name: 'some name', source_type_name: 'openshift' }],
      });
      expect(checkAppMock).toHaveBeenCalledWith(CREATED_APP_ID, 0);
      expect(checkSourceStatus.default).toHaveBeenCalledWith(CREATED_SOURCE_ID);
    });

    describe('failures', () => {
      let ERROR_MESSAGE;
      let returnError;
      let FORM_DATA;

      beforeEach(() => {
        ERROR_MESSAGE = 'some error message';
        errorHandling.handleError = jest.fn().mockImplementation((error) => Promise.resolve(error));
        returnError = jest.fn().mockImplementation(() => Promise.reject(ERROR_MESSAGE));
        FORM_DATA = {
          ...INITIAL_VALUES,
        };
      });

      it('source creation failed', async () => {
        api.getSourcesApi = () => ({
          ...mocks,
          bulkCreate: returnError,
        });

        let result;
        try {
          result = await doCreateSource(FORM_DATA);
        } catch (error) {
          result = error;
        }

        expect(result).toEqual(ERROR_MESSAGE);
        expect(returnError).toHaveBeenCalled();

        expect(bulkCreate).not.toHaveBeenCalled();
        expect(checkAppMock).not.toHaveBeenCalled();
        expect(checkSourceStatus.default).not.toHaveBeenCalled();
      });
    });
  });

  describe('helpers', () => {
    const EMPTY_OBJECT = {};

    describe('parseUrl', () => {
      it('parses URL', () => {
        expect(parseUrl(URL)).toEqual(EXPECTED_URL_OBJECT);
      });

      it('parses undefined', () => {
        expect(parseUrl(undefined)).toEqual(EMPTY_OBJECT);
      });

      it('throw empty object on error', () => {
        // eslint-disable-next-line no-console
        const tmpLog = console.log;
        // eslint-disable-next-line no-console
        console.log = jest.fn();

        const HOST = 'mycluster.net';
        const PATH = '/path';
        const PORT = '1234';
        const SCHEME = 'https';

        const WRONG_URL = `://${HOST}${SCHEME}:${PORT}${PATH}`;

        expect(parseUrl(WRONG_URL)).toEqual(EMPTY_OBJECT);

        // eslint-disable-next-line no-console
        console.log = tmpLog;
      });
    });

    describe('urlOrHost', () => {
      it('returns form data', () => {
        const FORM_DATA_WITHOUT_URL = {
          port: '1234',
          scheme: 'https',
        };

        expect(urlOrHost(FORM_DATA_WITHOUT_URL)).toEqual(FORM_DATA_WITHOUT_URL);
      });

      it('returns parsed url', () => {
        expect(urlOrHost({ url: URL })).toEqual(EXPECTED_URL_OBJECT);
      });
    });
  });
});
