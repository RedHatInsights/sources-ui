import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../../api/entities';
import { getProducts } from '../api';
import products from './__mocks__/products';

describe('marketplace api', () => {
  let mock;

  beforeEach(() => {
    mock = new MockAdapter(axiosInstance);
  });

  it('getProducts', async () => {
    mock.onGet('/api/marketplace-gateway/v1/unstable').reply(200, { data: products });

    const result = await getProducts();

    expect(result).toEqual({ data: products });
  });
});
