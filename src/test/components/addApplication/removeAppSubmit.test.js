import * as api from '../../../api/entities';
import removeAppSubmit from '../../../components/AddApplication/removeAppSubmit';

describe('removeAppSubmit', () => {
  it('calls function correctly with onCancel', () => {
    api.doDeleteApplication = jest.fn();

    const intl = {
      formatMessage: (message, values) => {
        return message.defaultMessage.replace('{ name }', values.name);
      },
    };
    const app = {
      id: '123',
      display_name: 'Catalog',
    };
    const onCancel = jest.fn();

    let result;
    const dispatch = jest.fn((x) => {
      result = x;
    });

    const source = { id: '56' };

    removeAppSubmit(app, intl, onCancel, dispatch, source);

    expect(onCancel).toHaveBeenCalled();
    expect(result).toEqual({
      meta: {
        appId: '123',
        notifications: { fulfilled: { dismissable: true, title: 'Catalog was removed from this source.', variant: 'success' } },
        sourceId: '56',
      },
      payload: expect.any(Function),
      type: 'REMOVE_APPLICATION',
    });

    expect(api.doDeleteApplication).not.toHaveBeenCalled();
    result.payload();
    expect(api.doDeleteApplication).toHaveBeenCalledWith(
      '123',
      'Removing of Catalog application from this source was unsuccessful.',
    );
  });
});
