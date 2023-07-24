import { checkAccountHCS } from '../../api/checkAccountHCS';

describe('checkAccountHCS', () => {
  let result;

  it('should return a correct value on success', async () => {
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

  it('should return a correct value on error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue({
      status: 500,
      statusText: 'test',
    });
    result = await checkAccountHCS();
    expect(result).toEqual({
      hcsDeal: false,
    });
  });

  it('should return a correct value on error', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValue(Promise.reject('rejected'));
    result = await checkAccountHCS();
    expect(result).toEqual({
      hcsDeal: false,
    });
  });
});
