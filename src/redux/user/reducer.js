import { ACTION_TYPES } from './actionTypes';

export const defaultUserState = {
  writePermissions: undefined,
  readIntegrationsEndpointsPermissions: undefined,
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

export const readIntegrationsEndpointsPermissionsPending = (state) => ({
  ...state,
  readIntegrationsEndpointsPermissions: undefined,
});

export const readIntegrationsEndpointsPermissionsLoaded = (state, { payload: readIntegrationsEndpointsPermissions }) => ({
  ...state,
  readIntegrationsEndpointsPermissions,
});

export default {
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING]: writePermissionsPending,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED]: writePermissionsLoaded,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED]: writePermissionsPending,
  [ACTION_TYPES.SET_ORG_ADMIN_PENDING]: isOrgAdminPending,
  [ACTION_TYPES.SET_ORG_ADMIN_FULFILLED]: isOrgAdminLoaded,
  [ACTION_TYPES.SET_ORG_ADMIN_REJECTED]: isOrgAdminPending,
  [ACTION_TYPES.SET_READ_INTEGRATIONS_ENDPOINTS_PERMISSIONS_PENDING]: readIntegrationsEndpointsPermissionsPending,
  [ACTION_TYPES.SET_READ_INTEGRATIONS_ENDPOINTS_PERMISSIONS_FULFILLED]: readIntegrationsEndpointsPermissionsLoaded,
  [ACTION_TYPES.SET_READ_INTEGRATIONS_ENDPOINTS_PERMISSIONS_REJECTED]: readIntegrationsEndpointsPermissionsPending,
};
