import MockAdapter from 'axios-mock-adapter';

import { doLoadSourceTypes } from '../../api/source_types';
import { axiosInstance } from '../../api/entities';

describe('source_types api', () => {
  it('gets source types from API', async () => {
    const mock = new MockAdapter(axiosInstance);

    const SOURCE_TYPES = ['1223', { x: '54651' }];

    mock.onGet('/api/sources/v3.1/source_types').reply(200, { data: SOURCE_TYPES });

    const result = await doLoadSourceTypes();

    expect(result).toEqual(SOURCE_TYPES);
  });
});
