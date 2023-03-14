import * as api from '../../api/entities';
import { checkAccountHCS, doLoadApplicationTypes, doLoadSourceTypes, findSource } from '../../api/wizardHelpers';

import applicationTypes from '../__mocks__/applicationTypes';
import sourceTypes from '../__mocks__/sourceTypes';

describe('wizardHelpers', () => {
  let listSourceTypes;
  let doLoadAppTypes;
  let postGraphQL;

  let result;

  beforeEach(() => {
    listSourceTypes = jest.fn().mockImplementation(() => Promise.resolve({ data: sourceTypes }));
    doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve({ data: applicationTypes }));
    postGraphQL = jest.fn().mockImplementation(() => Promise.resolve('ok'));

    api.getSourcesApi = () => ({
      listSourceTypes,
      doLoadAppTypes,
      postGraphQL,
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('doLoadSourceTypes', async () => {
    result = await doLoadSourceTypes();

    expect(result).toEqual({
      sourceTypes,
    });
  });

  it('doLoadApplicationTypes', async () => {
    result = await doLoadApplicationTypes();

    expect(result).toEqual({
      applicationTypes,
    });
  });

  it('checkAccountHCS - success', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 200,
      json: () => ({
        hcsDeal: true,
      }),
    });
    result = await checkAccountHCS();

    expect(result).toEqual({
      hcsDeal: true,
    });
  });

  it('checkAccountHCS - error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 500,
      statusText: 'test',
    });

    try {
      result = await checkAccountHCS();
    } catch (e) {
      expect(e).toEqual(new Error('Failed to verify HCS enrollment: test'));
    }
  });

  it('findSource', async () => {
    result = await findSource('id123');

    expect(result).toEqual('ok');
    expect(postGraphQL).toHaveBeenCalledWith({
      query: `{ sources(filter: {name: "name", value: "id123"})
        { id, name }
    }`,
    });
  });
});
