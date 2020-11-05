import { loadOrgAdmin, loadWritePermissions } from '../../../redux/user/actions';
import { ACTION_TYPES } from '../../../redux/user/actionTypes';

describe('user reducer actions', () => {
  let getUserSpy;
  let dispatch;

  let _insights;

  beforeEach(() => {
    _insights = insights;

    dispatch = jest.fn();
  });

  afterEach(() => {
    insights = _insights;
  });

  describe('loadOrgAdmin', () => {
    it('is org admin', async () => {
      const isOrgAdmin = true;

      getUserSpy = jest.fn().mockImplementation(() =>
        Promise.resolve({
          identity: {
            user: {
              is_org_admin: isOrgAdmin,
            },
          },
        })
      );

      insights = {
        chrome: {
          auth: {
            getUser: getUserSpy,
          },
        },
      };

      await loadOrgAdmin()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
        payload: isOrgAdmin,
      });
    });

    it('is not org admin', async () => {
      const isOrgAdmin = false;

      getUserSpy = jest.fn().mockImplementation(() =>
        Promise.resolve({
          identity: {
            user: {
              is_org_admin: isOrgAdmin,
            },
          },
        })
      );

      insights = {
        chrome: {
          auth: {
            getUser: getUserSpy,
          },
        },
      };

      await loadOrgAdmin()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_FULFILLED,
        payload: isOrgAdmin,
      });
    });

    it('rejected', async () => {
      const ERROR = {
        detail: 'detail',
      };

      getUserSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR));

      insights = {
        chrome: {
          auth: {
            getUser: getUserSpy,
          },
        },
      };

      await loadOrgAdmin()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_REJECTED,
        payload: { error: { detail: ERROR.detail, title: expect.any(String) } },
      });
    });

    it('rejected with data', async () => {
      const ERROR = {
        data: 'detail',
      };

      getUserSpy = jest.fn().mockImplementation(() => Promise.reject(ERROR));

      insights = {
        chrome: {
          auth: {
            getUser: getUserSpy,
          },
        },
      };

      await loadOrgAdmin()(dispatch);

      expect(dispatch.mock.calls.length).toEqual(2);

      expect(dispatch.mock.calls[0][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_PENDING,
      });
      expect(dispatch.mock.calls[1][0]).toEqual({
        type: ACTION_TYPES.SET_ORG_ADMIN_REJECTED,
        payload: { error: { detail: ERROR.data, title: expect.any(String) } },
      });
    });
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
