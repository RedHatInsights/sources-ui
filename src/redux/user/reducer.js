import { ACTION_TYPES } from './actionTypes';

export const defaultUserState = {
  isOrgAdmin: undefined,
  writePermissions: undefined,
};

export const orgAdminPending = (state) => ({
  ...state,
  isOrgAdmin: undefined,
});

export const orgAdminLoaded = (state, { payload: isOrgAdmin }) => ({
  ...state,
  isOrgAdmin,
});

export const orgAdminRejected = (state) => ({
  ...state,
  isOrgAdmin: undefined,
});

export const writePermissionsPending = (state) => ({
  ...state,
  writePermissions: undefined,
});

export const writePermissionsLoaded = (state, { payload: writePermissions }) => ({
  ...state,
  writePermissions,
});

export const writePermissionsRejected = (state) => ({
  ...state,
  writePermissions: undefined,
});

export default {
  [ACTION_TYPES.SET_ORG_ADMIN_PENDING]: orgAdminPending,
  [ACTION_TYPES.SET_ORG_ADMIN_FULFILLED]: orgAdminLoaded,
  [ACTION_TYPES.SET_ORG_ADMIN_REJECTED]: orgAdminRejected,

  [ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING]: writePermissionsPending,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED]: writePermissionsLoaded,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED]: writePermissionsRejected,
};
