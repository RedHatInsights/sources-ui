import MockAdapter from 'axios-mock-adapter';

import * as api from '../../api/entities';
import { checkSourceStatus } from '../../api/checkSourceStatus';

describe('checkSourceStatus', () => {
  let mock;
  let sourceId;

  beforeEach(() => {
    mock = new MockAdapter(api.axiosInstance);
    sourceId = '6544465';
  });

  it('calls checkAvalibilityStatus with source id', async () => {
    const response = { id: sourceId };

    mock.onPost(`/api/sources/v3.1/sources/${sourceId}/check_availability`).reply(200, response);

    const result = await checkSourceStatus(sourceId);

    expect(result).toEqual(response);
  });

  it('be totally cool when an error happens', async () => {
    mock.onPost(`/api/sources/v3.1/sources/${sourceId}/check_availability`).reply(500, 'MEGA ERROR');

    const result = await checkSourceStatus(sourceId);

    expect(result).toEqual(undefined);
  });
});
