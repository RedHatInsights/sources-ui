import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../../api/entities';
import { getCategories, getProducts } from '../api';
import categories from './__mocks__/categories';
import products from './__mocks__/products';

describe('marketplace api', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  it('getProducts', async () => {
    mock
      .onGet('/api/marketplace-gateway/v1/unstable', {
        params: {
          limit: 10,
          offset: 0,
        },
      })
      .reply(200, { data: products });

    const result = await getProducts();

    expect(result).toEqual({ data: products });
  });

  it('getProducts custom config', async () => {
    mock
      .onGet('/api/marketplace-gateway/v1/unstable', {
        params: {
          limit: 20,
          offset: 20,
        },
      })
      .reply(200, { data: products });

    const result = await getProducts({ page: 2, perPage: 20 });

    expect(result).toEqual({ data: products });
  });

  it('getCategories', async () => {
    mock.onGet('/api/marketplace-gateway/v1/categories').reply(200, { data: categories });

    const result = await getCategories();

    expect(result).toEqual({ data: categories });
  });
});
