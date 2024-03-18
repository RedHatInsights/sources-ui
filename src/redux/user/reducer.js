import { ACTION_TYPES } from './actionTypes';

export const defaultUserState = {
  writePermissions: undefined,
  integrationsEndpointsPermissions: undefined,
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

export const integrationsEndpointsPermissionsPending = (state) => ({
  ...state,
  integrationsEndpointsPermissions: undefined,
});

export const integrationsEndpointsPermissionsLoaded = (state, { payload: integrationsEndpointsPermissions }) => ({
  ...state,
  integrationsEndpointsPermissions,
});

export default {
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_PENDING]: writePermissionsPending,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_FULFILLED]: writePermissionsLoaded,
  [ACTION_TYPES.SET_WRITE_PERMISSIONS_REJECTED]: writePermissionsPending,
  [ACTION_TYPES.SET_ORG_ADMIN_PENDING]: isOrgAdminPending,
  [ACTION_TYPES.SET_ORG_ADMIN_FULFILLED]: isOrgAdminLoaded,
  [ACTION_TYPES.SET_ORG_ADMIN_REJECTED]: isOrgAdminPending,
  [ACTION_TYPES.SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_PENDING]: integrationsEndpointsPermissionsPending,
  [ACTION_TYPES.SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_FULFILLED]: integrationsEndpointsPermissionsLoaded,
  [ACTION_TYPES.SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_REJECTED]: integrationsEndpointsPermissionsPending,
};
