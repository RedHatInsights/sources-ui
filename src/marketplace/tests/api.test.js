import MockAdapter from 'axios-mock-adapter';
import { axiosInstance } from '../../api/entities';
import { getProducts } from '../api';
import products from './__mocks__/products';

describe('marketplace api', () => {
  let mock;

  let protoTmp = Storage;

  beforeEach(() => {
    const localStorage = {
      'marketplace-key': 'some-value',
    };
    Object.assign(Storage, {});
    Storage.prototype.getItem = jest.fn((name) => localStorage[name]);

    mock = new MockAdapter(axiosInstance);
  });

  afterEach(() => {
    Object.assign(Storage, protoTmp);
  });

  it('getProducts', async () => {
    mock
      .onPost('https://sandbox.marketplace.redhat.com/api-security/om-auth/cloud/token')
      .reply(200, { access_token: 'SOME-TOKEN' });
    mock.onPost('https://sandbox.marketplace.redhat.com/catalog/gql').reply(200, products);

    const result = await getProducts();

    expect(mock.history.post).toHaveLength(2);
    expect(JSON.parse(mock.history.post[0].data)).toEqual({
      apikey: 'some-value',
      grant_type: 'urn:ibm:params:oauth:grant-type:apikey',
    });

    expect(result).toEqual(products);

    // remember token
    await getProducts();
    expect(mock.history.post).toHaveLength(3);
  });
});
