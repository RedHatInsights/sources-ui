import { ACTION_TYPES } from './actionTypes';

export const defaultUserState = {
  writePermissions: undefined,
  isOrgAdmin: undefined,
};

export const writePermissionsPending = (state) => ({
  ...state,
  writePermissions: undefined,
});

export const writePermissionsLoaded = (state, { payload: writePermissions }) => ({
  ...state,
  writePermissions,
});

export const isOrgAdminPending = (state) => ({
  ...state,
  isOrgAdmin: undefined,
});

export const isOrgAdminLoaded = (state, { payload: isOrgAdmin }) => ({
  ...state,
  isOrgAdmin,
});

export default {
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING]: writePermissionsPending,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED]: writePermissionsLoaded,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED]: writePermissionsPending,
  [ACTION_TYPES.SET_ORG_ADMIN_PENDING]: isOrgAdminPending,
  [ACTION_TYPES.SET_ORG_ADMIN_FULFILLED]: isOrgAdminLoaded,
  [ACTION_TYPES.SET_ORG_ADMIN_REJECTED]: isOrgAdminPending,
};
