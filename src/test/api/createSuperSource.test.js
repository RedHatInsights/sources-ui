import createSuperSource from '../../api/createSuperSource';
import { ACCOUNT_AUTHORIZATION } from '../../components/constants';
import { COST_MANAGEMENT_APP, SUB_WATCH_APP } from '../addSourceWizard/../__mocks__/applicationTypes';

import * as api from '../../api/entities';
import * as errorHandling from '../../api/handleError';
import * as checkApp from '../../api/getApplicationStatus';
import * as checkSourceStatus from '../../api/checkSourceStatus';

describe('createSuperSource', () => {
  let CREATE_SOURCE_DATA_OUT;
  let FORM_DATA;

  let bulkCreate;
  let checkAppMock;

  let mocks;

  const SOURCE_ID = '1243423';
  const APP_ID1 = 'ejsi6hs8';
  const APP_ID2 = '95gss976';
  const AUTH_ID = '65TERa8';

  beforeEach(() => {
    CREATE_SOURCE_DATA_OUT = {
      sources: [{ id: SOURCE_ID }],
      applications: [{ id: APP_ID1 }, { id: APP_ID2 }],
      authentications: [{ id: AUTH_ID }],
    };

    bulkCreate = jest.fn().mockImplementation(() => Promise.resolve(CREATE_SOURCE_DATA_OUT));
    checkSourceStatus.default = jest.fn();
    checkAppMock = jest.fn().mockImplementation((id) => Promise.resolve({ id }));
    checkApp.checkAppAvailability = checkAppMock;

    mocks = {
      bulkCreate,
    };

    FORM_DATA = {
      source: { name: 'my_source', app_creation_workflow: ACCOUNT_AUTHORIZATION },
      source_type: 'amazon',
      applications: [COST_MANAGEMENT_APP.id, SUB_WATCH_APP.id],
      authentication: {
        username: 'my_username',
        password: 'my_password',
      },
    };
  });

  it('create AWS source with apps', async () => {
    api.getSourcesApi = () => mocks;

    const result = await createSuperSource(FORM_DATA);

    expect(result).toEqual({ ...CREATE_SOURCE_DATA_OUT, ...CREATE_SOURCE_DATA_OUT.sources[0] });

    expect(bulkCreate).toHaveBeenCalledWith({
      applications: [
        { application_type_id: '2', source_name: 'my_source' },
        { application_type_id: '5', source_name: 'my_source' },
      ],
      authentications: [
        { password: 'my_password', username: 'my_username', resource_name: 'my_source', resource_type: 'source' },
      ],
      sources: [{ app_creation_workflow: ACCOUNT_AUTHORIZATION, name: 'my_source', source_type_name: 'amazon' }],
    });
    expect(checkSourceStatus.default).not.toHaveBeenCalled();
    expect(checkAppMock.mock.calls[0][0]).toEqual(AUTH_ID);
  });

  it('handles error', async () => {
    expect.assertions(4);

    const failedBulkCreate = jest.fn().mockImplementation(() => Promise.reject());

    api.getSourcesApi = () => ({ ...mocks, bulkCreate: failedBulkCreate });

    errorHandling.default = jest.fn().mockImplementation(() => 'super error');

    try {
      await createSuperSource(FORM_DATA);
    } catch (e) {
      expect(e).toEqual('super error');

      expect(failedBulkCreate).toHaveBeenCalledWith({
        applications: [
          { application_type_id: '2', source_name: 'my_source' },
          { application_type_id: '5', source_name: 'my_source' },
        ],
        authentications: [
          { password: 'my_password', username: 'my_username', resource_name: 'my_source', resource_type: 'source' },
        ],
        sources: [{ app_creation_workflow: ACCOUNT_AUTHORIZATION, name: 'my_source', source_type_name: 'amazon' }],
      });
      expect(checkSourceStatus.default).not.toHaveBeenCalled();
      expect(checkAppMock).not.toHaveBeenCalled();
    }
  });
});
