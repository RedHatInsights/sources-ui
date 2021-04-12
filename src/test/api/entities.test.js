import MockAdapter from 'axios-mock-adapter';

import * as api from '../../api/entities';

import { applicationTypesData, COSTMANAGEMENT_APP } from '../__mocks__/applicationTypesData';
import { AMAZON_ID, sourceTypesData, AZURE_ID } from '../__mocks__/sourceTypesData';

describe('entities spec', () => {
  const ERROR_DETAIL = 'error detail';

  describe('API calls', () => {
    let mock;

    const SOURCE_ID = '54645';
    const params = {
      pageSize: 20,
      pageNumber: 1,
      sortBy: 'name',
      sortDirection: 'desc',
      filterValue: { name: 'pepa' },
    };
    const ERROR_RESPONSE = { errors: [{ detail: ERROR_DETAIL }] };
    const PARSED_ERROR = { error: { detail: ERROR_DETAIL } };
    const OK_RESPONSE = { ok: 'ok' };

    beforeEach(() => {
      mock = new MockAdapter(api.axiosInstance);
    });

    it('doLoadAppTypes loads appTypes', async () => {
      const APP_TYPES = ['1223', { x: '54651' }];

      mock.onGet('/api/sources/v3.1/application_types').reply(200, { data: APP_TYPES });

      const result = await api.doLoadAppTypes();

      expect(result).toEqual({ data: APP_TYPES });
    });

    it('doDeleteAuthentication deletes authentication', async () => {
      const AUTH_ID = '123232';

      mock.onDelete(`/api/sources/v3.1/authentications/${AUTH_ID}`).reply(200, OK_RESPONSE);

      const result = await api.doDeleteAuthentication(AUTH_ID);

      expect(result).toEqual(OK_RESPONSE);
    });

    it('doRemoveSource deletes source', async () => {
      mock.onDelete(`/api/sources/v3.1/sources/${SOURCE_ID}`).reply(200, OK_RESPONSE);

      const result = await api.doRemoveSource(SOURCE_ID);

      expect(result).toEqual(OK_RESPONSE);
    });

    describe('getSourcesApi', () => {
      const DATA = { data: 'some data' };

      it('updateSource', async () => {
        const method = 'Patch';
        mock[`on${method}`](`/api/sources/v3.1/sources/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().updateSource(SOURCE_ID, DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('updateEndpoint', async () => {
        const method = 'Patch';
        mock[`on${method}`](`/api/sources/v3.1/endpoints/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().updateEndpoint(SOURCE_ID, DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('createEndpoint', async () => {
        const method = 'Post';
        mock[`on${method}`](`/api/sources/v3.1/endpoints`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().createEndpoint(DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('updateAuthentication', async () => {
        const method = 'Patch';
        mock[`on${method}`](`/api/sources/v3.1/authentications/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().updateAuthentication(SOURCE_ID, DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('createAuthentication', async () => {
        const method = 'Post';
        mock[`on${method}`](`/api/sources/v3.1/authentications`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().createAuthentication(DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('showSource', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/sources/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().showSource(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('listSourceEndpoints', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/sources/${SOURCE_ID}/endpoints`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().listSourceEndpoints(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('listSourceApplications', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/sources/${SOURCE_ID}/applications`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().listSourceApplications(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('listEndpointAuthentications', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/endpoints/${SOURCE_ID}/authentications`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().listEndpointAuthentications(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('createAuthApp', async () => {
        mock.onPost(`/api/sources/v3.1/application_authentications`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().createAuthApp({
          application_type: 'app_id',
          authentication_id: 'auth_id',
        });

        expect(result).toEqual(OK_RESPONSE);

        expect(mock.history.post[0].data).toEqual('{"application_type":"app_id","authentication_id":"auth_id"}');
      });

      it('showAuthentication', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/authentications/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().showAuthentication(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('getEndpoint', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/endpoints/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().getEndpoint(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('updateApplication', async () => {
        const method = 'Patch';
        mock[`on${method}`](`/api/sources/v3.1/applications/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().updateApplication(SOURCE_ID, DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('showApplication', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/applications/${SOURCE_ID}`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().showApplication(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('listSourceAuthentications', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/sources/${SOURCE_ID}/authentications`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().listSourceAuthentications(SOURCE_ID);

        expect(result).toEqual(OK_RESPONSE);
      });

      it('createSource', async () => {
        const method = 'Post';
        mock[`on${method}`](`/api/sources/v3.1/sources`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().createSource(DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('bulkCreate', async () => {
        const method = 'Post';
        mock[`on${method}`](`/api/sources/v3.1/bulk_create`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().bulkCreate(DATA);

        expect(result).toEqual(OK_RESPONSE);
        expect(mock.history[method.toLowerCase()][0].data).toEqual(JSON.stringify(DATA));
      });

      it('getGoogleAccount', async () => {
        const method = 'Get';
        mock[`on${method}`](`/api/sources/v3.1/app_meta_data?filter[name]=gcp_service_account`).reply(200, OK_RESPONSE);

        const result = await api.getSourcesApi().getGoogleAccount();

        expect(result).toEqual(OK_RESPONSE);
      });
    });

    it('doRemoveSource fails', async () => {
      expect.assertions(1);

      mock.onDelete(`/api/sources/v3.1/sources/${SOURCE_ID}`).reply(500, ERROR_RESPONSE);

      try {
        await api.doRemoveSource(SOURCE_ID);
      } catch (error) {
        expect(error).toEqual(PARSED_ERROR);
      }
    });

    it('doLoadEntities loads sources', async () => {
      const ENTITIES = [{ entity1: true }, { entity2: true }];

      mock.onPost(`/api/sources/v3.1/graphql`).reply(200, { data: ENTITIES });

      const result = await api.doLoadEntities(params);

      expect(result).toEqual(ENTITIES);
      expect(mock.history.post[0].data.includes(api.graphQlAttributes.replace(/\n/g, '\\n'))).toEqual(true);

      const expectedGraphQlParameters = ['limit', 'offset', 'sort_by', 'filter', 'contains_i'];

      expectedGraphQlParameters.forEach((param) => {
        expect(mock.history.post[0].data.includes(param)).toEqual(true);
      });

      const expectedGraphQlValues = ['20', '0', 'name', 'desc', 'pepa'];

      expectedGraphQlValues.forEach((param) => {
        expect(mock.history.post[0].data.includes(param)).toEqual(true);
      });
    });

    it('doCreateApplication creates app', async () => {
      const APP_TYPE_ID = '1212';

      mock.onPost('/api/sources/v3.1/applications').reply(200, OK_RESPONSE);

      const result = await api.doCreateApplication({ source_id: SOURCE_ID, application_type_id: APP_TYPE_ID });

      expect(result).toEqual(OK_RESPONSE);

      expect(mock.history.post[0].data).toEqual(
        JSON.stringify({
          source_id: SOURCE_ID,
          application_type_id: APP_TYPE_ID,
        })
      );
    });

    it('doDeleteApplication deletes app', async () => {
      const APP_ID = '4546518132165';

      mock.onDelete(`/api/sources/v3.1/applications/${APP_ID}`).reply(200, OK_RESPONSE);

      const result = await api.doDeleteApplication(APP_ID, 'error');

      expect(result).toEqual(OK_RESPONSE);
    });

    it('doDeleteApplication fails', async () => {
      const APP_ID = '4546518132165';
      const ERROR_TITLE = 'error title';

      mock.onDelete(`/api/sources/v3.1/applications/${APP_ID}`).reply(500, ERROR_RESPONSE);

      try {
        await api.doDeleteApplication(APP_ID, ERROR_TITLE);
      } catch (error) {
        expect(error).toEqual({
          error: {
            ...PARSED_ERROR.error,
            title: ERROR_TITLE,
          },
        });
      }
    });

    it('doLoadCountOfSources loads count of sources', async () => {
      mock.onGet(`/api/sources/v3.1/sources?filter[name][contains_i]=pepa&limit=1`).reply(200, { response: 'spec response' });

      const result = await api.doLoadCountOfSources({ name: 'pepa' });

      expect(result).toEqual({ response: 'spec response' });
    });

    it('doLoadSource', async () => {
      const ENTITIES = [{ entity1: true }];

      mock.onPost(`/api/sources/v3.1/graphql`).reply(200, { data: ENTITIES });

      const result = await api.doLoadSource(SOURCE_ID);

      expect(result).toEqual(ENTITIES);

      expect(mock.history.post[0].data.includes('id')).toEqual(true);
      expect(mock.history.post[0].data.includes('eq')).toEqual(true);
      expect(mock.history.post[0].data.includes(SOURCE_ID)).toEqual(true);
    });

    it('doLoadApplicationsForEdit', async () => {
      const ENTITIES = [{ entity1: true }];

      mock.onPost(`/api/sources/v3.1/graphql`).reply(200, { data: ENTITIES });

      const result = await api.doLoadApplicationsForEdit(SOURCE_ID, applicationTypesData.data, sourceTypesData.data);

      expect(result).toEqual(ENTITIES);

      expect(mock.history.post[0].data.includes('id')).toEqual(true);
      expect(mock.history.post[0].data.includes('eq')).toEqual(true);
      expect(mock.history.post[0].data.includes(SOURCE_ID)).toEqual(true);
    });

    it('doLoadApplicationsForEdit - load extra for applications', async () => {
      const ENTITIES = {
        sources: [
          {
            applications: [{ id: '123' }, { id: '456' }],
          },
        ],
      };

      mock.onPost(`/api/sources/v3.1/graphql`).reply(200, { data: ENTITIES });
      mock.onGet(`/api/sources/v3.1/applications/123`).reply(200, { extra: { dataset: '134' } });
      mock.onGet(`/api/sources/v3.1/applications/456`).reply(200, { extra: { username: 'jsmith' } });

      const result = await api.doLoadApplicationsForEdit(SOURCE_ID, applicationTypesData.data, sourceTypesData.data);

      expect(result).toEqual({
        sources: [
          {
            applications: [
              { extra: { dataset: '134' }, id: '123' },
              { extra: { username: 'jsmith' }, id: '456' },
            ],
          },
        ],
      });
    });

    describe('cost management temporarily loader', () => {
      it('doLoadApplicationsForEdit - load extra for old cost management - amazon', async () => {
        const ENTITIES = {
          sources: [
            {
              source_type_id: AMAZON_ID,
              applications: [{ id: '123' }],
            },
          ],
        };

        mock.onPost(`/api/sources/v3.1/graphql`).reply(200, { data: ENTITIES });
        mock.onGet(`/api/sources/v3.1/applications/123`).reply(200, { application_type_id: COSTMANAGEMENT_APP.id, extra: {} });
        mock.onGet(`/api/cost-management/v1/sources/${SOURCE_ID}/`).reply(200, {
          billing_source: {
            data_source: {
              bucket: 'some-bucket',
              resource_group: 'some-resource-group',
              storage_account: 'some-storage_account',
            },
          },
          authentication: {
            credentials: {
              subscription_id: 'some-sub-id',
            },
          },
        });

        const result = await api.doLoadApplicationsForEdit(SOURCE_ID, applicationTypesData.data, sourceTypesData.data);

        expect(result).toEqual({
          sources: [
            {
              source_type_id: AMAZON_ID,
              applications: [
                {
                  id: '123',
                  extra: {
                    bucket: 'some-bucket',
                    resource_group: 'some-resource-group',
                    storage_account: 'some-storage_account',
                    subscription_id: 'some-sub-id',
                  },
                },
              ],
            },
          ],
        });
      });

      it('doLoadApplicationsForEdit - load extra for old cost management - azure', async () => {
        const ENTITIES = {
          sources: [
            {
              source_type_id: AZURE_ID,
              applications: [{ id: '123' }],
            },
          ],
        };

        mock.onPost(`/api/sources/v3.1/graphql`).reply(200, { data: ENTITIES });
        mock.onGet(`/api/sources/v3.1/applications/123`).reply(200, { application_type_id: COSTMANAGEMENT_APP.id, extra: {} });
        mock.onGet(`/api/cost-management/v1/sources/${SOURCE_ID}/`).reply(200, {
          billing_source: {
            data_source: {
              bucket: 'some-bucket',
              resource_group: 'some-resource-group',
              storage_account: 'some-storage_account',
            },
          },
          authentication: {
            credentials: {
              subscription_id: 'some-sub-id',
            },
          },
        });

        const result = await api.doLoadApplicationsForEdit(SOURCE_ID, applicationTypesData.data, sourceTypesData.data);

        expect(result).toEqual({
          sources: [
            {
              source_type_id: AZURE_ID,
              applications: [
                {
                  id: '123',
                  extra: {
                    bucket: 'some-bucket',
                    resource_group: 'some-resource-group',
                    storage_account: 'some-storage_account',
                    subscription_id: 'some-sub-id',
                  },
                },
              ],
            },
          ],
        });
      });

      it('doLoadApplicationsForEdit - does not load extra for old cost management - azure', async () => {
        const ENTITIES = {
          sources: [
            {
              source_type_id: AZURE_ID,
              applications: [{ id: '123' }],
            },
          ],
        };

        mock.onPost(`/api/sources/v3.1/graphql`).reply(200, { data: ENTITIES });
        mock
          .onGet(`/api/sources/v3.1/applications/123`)
          .reply(200, { application_type_id: COSTMANAGEMENT_APP.id, extra: { some: 'extra' } });

        const result = await api.doLoadApplicationsForEdit(SOURCE_ID, applicationTypesData.data, sourceTypesData.data);

        expect(result).toEqual({
          sources: [
            {
              source_type_id: AZURE_ID,
              applications: [
                {
                  id: '123',
                  extra: {
                    some: 'extra',
                  },
                },
              ],
            },
          ],
        });
      });
    });
  });

  describe('graphQlErrorInterceptor', () => {
    it('is error', async () => {
      const response = {
        errors: [
          {
            message: ERROR_DETAIL,
          },
        ],
        data: [1, 2, 3],
      };

      try {
        await api.graphQlErrorInterceptor(response);
      } catch (error) {
        expect(error).toEqual({ detail: ERROR_DETAIL });
      }
    });

    it('is not error', () => {
      const response = {
        errors: [],
        data: [1, 2, 3],
      };
      expect(api.graphQlErrorInterceptor(response)).toEqual(response);
    });
  });

  describe('403 error interceptor', () => {
    it('is 403 error', async () => {
      const response = {
        errors: [
          {
            detail: ERROR_DETAIL,
            status: 403,
          },
        ],
        data: [],
      };

      try {
        await api.interceptor403(response);
      } catch (error) {
        expect(error).toEqual({
          detail: ERROR_DETAIL,
          title: 'Forbidden access',
        });
      }
    });

    it('is not 403 error', async () => {
      const response = {
        errors: [
          {
            detail: ERROR_DETAIL,
            status: 405,
          },
        ],
        data: [],
      };

      try {
        await api.interceptor403(response);
      } catch (error) {
        expect(error).toEqual(response);
      }
    });
  });
});
