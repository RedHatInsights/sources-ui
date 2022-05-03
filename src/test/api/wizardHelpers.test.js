import * as api from '../../api/entities';
import { doLoadApplicationTypes, doLoadSourceTypes, findSource } from '../../api/wizardHelpers';

import applicationTypesData from '../__mocks__/applicationTypesData';
import sourceTypes from '../__mocks__/sourceTypes';

describe('wizardHelpers', () => {
  let listSourceTypes;
  let doLoadAppTypes;
  let postGraphQL;

  let result;

  beforeEach(() => {
    listSourceTypes = jest.fn().mockImplementation(() => Promise.resolve({ data: sourceTypes }));
    doLoadAppTypes = jest.fn().mockImplementation(() => Promise.resolve({ data: applicationTypesData.data }));
    postGraphQL = jest.fn().mockImplementation(() => Promise.resolve('ok'));

    api.getSourcesApi = () => ({
      listSourceTypes,
      doLoadAppTypes,
      postGraphQL,
    });
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
      applicationTypes: applicationTypesData.data,
    });
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
