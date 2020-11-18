import * as api from '../../api/entities';
import * as cmApi from '../../api/getCmValues';
import { doLoadSourceForEdit } from '../../api/doLoadSourceForEdit';

describe('doLoadSourceForEdit', () => {
  const SOURCE_ID = '2324232321';
  const SOURCE = { id: SOURCE_ID };
  let hasCostManagement;

  let mocks;

  const SOURCE_DATA = {
    name: 'source',
    created_at: '12-12-2022',
  };

  const EMPTY_DATA = {
    data: [],
  };

  const ENDPOINT_ID = '8643928983';

  const ENDPOINT_DATA = {
    data: [
      {
        id: ENDPOINT_ID,
        receptor_node: 'node',
        scheme: 'https://',
        port: 6578,
      },
    ],
  };

  const AUTHENTICATION_DATA = {
    data: [
      {
        id: '2323',
        authtype: 'receptor_node',
      },
    ],
  };

  const CM_SOURCE_DATA = {
    name: 'name',
    billing_source: {
      bucket: 'nugget',
    },
    authentication: {
      credentials: {
        subscription: '23234232',
      },
    },
  };

  beforeEach(() => {
    mocks = {
      showSource: jest.fn().mockImplementation(() => Promise.resolve(SOURCE_DATA)),
      listSourceEndpoints: jest.fn().mockImplementation(() => Promise.resolve(EMPTY_DATA)),
      listEndpointAuthentications: jest.fn().mockImplementation(() => Promise.resolve(EMPTY_DATA)),
      showAuthentication: jest.fn().mockImplementation(() => Promise.resolve(EMPTY_DATA)),
    };

    api.getSourcesApi = () => mocks;
    cmApi.getCmValues = jest.fn().mockImplementation(() => Promise.reject());
    api.doLoadApplicationsForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: [
          {
            applications: [],
          },
        ],
      })
    );

    hasCostManagement = true;
  });

  it('return source without endpoint', async () => {
    const result = await doLoadSourceForEdit(SOURCE);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).not.toHaveBeenCalledWith();
    expect(mocks.listEndpointAuthentications).not.toHaveBeenCalled();

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [],
    });
  });

  it('return source without endpoint and with applications', async () => {
    const APPLICATION_DATA = {
      id: '2323322',
    };

    api.doLoadApplicationsForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: [
          {
            applications: [APPLICATION_DATA],
          },
        ],
      })
    );

    api.getSourcesApi = () => mocks;

    const result = await doLoadSourceForEdit(SOURCE);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).not.toHaveBeenCalledWith();
    expect(mocks.listEndpointAuthentications).not.toHaveBeenCalled();
    expect(mocks.showAuthentication).not.toHaveBeenCalled();

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [APPLICATION_DATA],
    });
  });

  it('return source without endpoint and with applications - load authentications for apps', async () => {
    const AUTHENTICATION_DATA_1 = { id: '123' };
    const AUTHENTICATION_DATA_2 = { id: '345' };

    const APPLICATION_DATA = {
      id: '2323322',
      authentications: [AUTHENTICATION_DATA_1, AUTHENTICATION_DATA_2],
    };

    api.doLoadApplicationsForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: [
          {
            applications: [APPLICATION_DATA],
          },
        ],
      })
    );

    api.getSourcesApi = () => mocks;

    const result = await doLoadSourceForEdit(SOURCE);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).not.toHaveBeenCalledWith();
    expect(mocks.listEndpointAuthentications).not.toHaveBeenCalled();
    expect(mocks.showAuthentication.mock.calls).toEqual([[AUTHENTICATION_DATA_1.id], [AUTHENTICATION_DATA_2.id]]);

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [APPLICATION_DATA],
    });
  });

  it('return source without endpoint and with applications - load authentications for apps, exclude them from common auths', async () => {
    const AUTHENTICATION_DATA_1 = { id: '123' };
    const AUTHENTICATION_DATA_2 = { id: '345' };

    const APPLICATION_DATA = {
      id: '2323322',
      authentications: [AUTHENTICATION_DATA_1, AUTHENTICATION_DATA_2],
    };

    api.doLoadApplicationsForEdit = jest.fn().mockImplementation(() =>
      Promise.resolve({
        sources: [
          {
            applications: [APPLICATION_DATA],
          },
        ],
      })
    );

    const AUTHENTICATION_DATA = {
      data: [
        {
          id: '123', //will be filtered
        },
        {
          id: 'different',
        },
      ],
    };

    mocks = {
      ...mocks,
      listSourceEndpoints: jest.fn().mockImplementation(() => Promise.resolve(ENDPOINT_DATA)),
      listEndpointAuthentications: jest.fn().mockImplementation(() => Promise.resolve(AUTHENTICATION_DATA)),
    };

    api.getSourcesApi = () => mocks;

    const result = await doLoadSourceForEdit(SOURCE);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).not.toHaveBeenCalledWith();
    expect(mocks.listEndpointAuthentications).toHaveBeenCalledWith(ENDPOINT_ID);
    expect(mocks.showAuthentication.mock.calls).toEqual([[AUTHENTICATION_DATA_1.id], [AUTHENTICATION_DATA_2.id]]);

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [APPLICATION_DATA],
      authentications: [AUTHENTICATION_DATA.data[1]],
      endpoints: ENDPOINT_DATA.data,
    });
  });

  it('return source with endpoint and auth', async () => {
    mocks = {
      ...mocks,
      listSourceEndpoints: jest.fn().mockImplementation(() => Promise.resolve(ENDPOINT_DATA)),
      listEndpointAuthentications: jest.fn().mockImplementation(() => Promise.resolve(AUTHENTICATION_DATA)),
    };

    api.getSourcesApi = () => mocks;

    const result = await doLoadSourceForEdit(SOURCE);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).not.toHaveBeenCalledWith();
    expect(mocks.listEndpointAuthentications).toHaveBeenCalledWith(ENDPOINT_ID);

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [],
      endpoints: ENDPOINT_DATA.data,
      authentications: AUTHENTICATION_DATA.data,
    });
  });

  it('return source with cost management values', async () => {
    cmApi.getCmValues = jest.fn().mockImplementation(() => Promise.resolve(CM_SOURCE_DATA));

    const result = await doLoadSourceForEdit(SOURCE, hasCostManagement);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listEndpointAuthentications).not.toHaveBeenCalled();

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [],
      billing_source: CM_SOURCE_DATA.billing_source,
      credentials: CM_SOURCE_DATA.authentication.credentials,
    });
  });

  it('return source with cost management values - rejected cost', async () => {
    const result = await doLoadSourceForEdit(SOURCE, hasCostManagement);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listEndpointAuthentications).not.toHaveBeenCalled();

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [],
    });
  });

  it('return source with cost management values and endpoint', async () => {
    mocks = {
      ...mocks,
      listSourceEndpoints: jest.fn().mockImplementation(() => Promise.resolve(ENDPOINT_DATA)),
      listEndpointAuthentications: jest.fn().mockImplementation(() => Promise.resolve(AUTHENTICATION_DATA)),
    };
    api.getSourcesApi = () => mocks;
    cmApi.getCmValues = jest.fn().mockImplementation(() => Promise.resolve(CM_SOURCE_DATA));

    const result = await doLoadSourceForEdit(SOURCE, hasCostManagement);

    expect(mocks.showSource).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listSourceEndpoints).toHaveBeenCalledWith(SOURCE_ID);
    expect(api.doLoadApplicationsForEdit).toHaveBeenCalledWith(SOURCE_ID);
    expect(cmApi.getCmValues).toHaveBeenCalledWith(SOURCE_ID);
    expect(mocks.listEndpointAuthentications).toHaveBeenCalledWith(ENDPOINT_ID);

    expect(result).toEqual({
      source: {
        ...SOURCE,
        ...SOURCE_DATA,
      },
      applications: [],
      billing_source: CM_SOURCE_DATA.billing_source,
      credentials: CM_SOURCE_DATA.authentication.credentials,
      endpoints: ENDPOINT_DATA.data,
      authentications: AUTHENTICATION_DATA.data,
    });
  });
});
