import * as api from '../../api/entities';
import MockAdapter from 'axios-mock-adapter';
import { doLoadRegions } from '../../api/doLoadRegions';

describe('doLoadRegions', () => {
  let mock;
  beforeEach(() => {
    mock = new MockAdapter(api.axiosInstance);
  });

  it('calls doLoadRegions', async () => {
    const data = ['region1', 'region2'];
    const response = { meta: { count: 2 }, data };

    mock.onGet('/api/cost-management/v1/sources/aws-s3-regions/').reply(200, response);

    const result = await doLoadRegions();

    expect(result).toEqual(data);
  });

  it('return an empty array when an error happens', async () => {
    mock.onGet('/api/cost-management/v1/sources/aws-s3-regions/').reply(500, 'MEGA ERROR');

    const result = await doLoadRegions();

    expect(result).toEqual([]);
  });
});
