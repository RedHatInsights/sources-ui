import { loadWritePermissions } from '../../../redux/user/actions';
import { ACTION_TYPES } from '../../../redux/user/actionTypes';

describe('user reducer actions', () => {
  let dispatch;

  let _insights;

  beforeEach(() => {
    _insights = insights;

    dispatch = jest.fn();
  });

  afterEach(() => {
    insights = _insights;
  });

  describe('loadWritePermissions', () => {
    let getUserPermissions;

    it('has write permissions - all', async () => {
      getUserPermissions = jest.fn().mockImplementation(() => Promise.resolve([{ permission: 'sources:*:*' }]));

      insights = {
        chrome: {
          getUserPermissions,
        },
      };

      await loadWritePermissions()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED,
        payload: true,
      });
    });

    it('has write permissions - just write', async () => {
      getUserPermissions = jest.fn().mockImplementation(() => Promise.resolve([{ permission: 'sources:*:write' }]));

      insights = {
        chrome: {
          getUserPermissions,
        },
      };

      await loadWritePermissions()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED,
        payload: true,
      });
    });

    it('does not have write permissions', async () => {
      getUserPermissions = jest.fn().mockImplementation(() => Promise.resolve([]));

      insights = {
        chrome: {
          getUserPermissions,
        },
      };

      await loadWritePermissions()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED,
        payload: false,
      });
    });

    it('rejected', async () => {
      const ERROR = {
        detail: 'detail',
      };

      getUserPermissions = jest.fn().mockImplementation(() => Promise.reject(ERROR));

      insights = {
        chrome: {
          getUserPermissions,
        },
      };

      await loadWritePermissions()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED,
        payload: { error: { detail: ERROR.detail, title: expect.any(String) } },
      });
    });

    it('rejected with data', async () => {
      const ERROR = {
        data: 'detail',
      };

      getUserPermissions = jest.fn().mockImplementation(() => Promise.reject(ERROR));

      insights = {
        chrome: {
          getUserPermissions,
        },
      };

      await loadWritePermissions()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED,
        payload: { error: { detail: ERROR.data, title: expect.any(String) } },
      });
    });
  });
});
