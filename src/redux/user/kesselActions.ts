import { ACTION_TYPES } from './actionTypes';
import { mapKesselToV1Permissions } from '../../rbac/utils/permissionMapper';
import { KesselRbacAccessContextValue } from '../../rbac/KesselRbacAccessContext';

/**
 * Load integrations permissions from Kessel v2 and map them to the existing Redux state structure.
 * This allows v2 orgs to use Kessel permissions for integrations without changing the rest of the application.
 *
 * Note: Sources permissions continue using Chrome API v1 (loaded separately) until sources service migrates to Kessel.
 *
 * @param kesselPermissions - Permissions from KesselRbacAccessContext
 */
export const loadPermissionsFromKessel =
  (kesselPermissions: KesselRbacAccessContextValue['permissions']) => (dispatch: any) => {
    // Map Kessel v2 permissions to v1 Redux state structure
    const v1Permissions = mapKesselToV1Permissions(kesselPermissions);

    // Dispatch integrations permission updates (sources permissions loaded separately via Chrome API)
    dispatch({
      type: (ACTION_TYPES as any).SET_INTEGRATIONS_ENDPOINTS_PERMISSIONS_FULFILLED,
      payload: v1Permissions.integrationsEndpointsPermissions,
    });

    dispatch({
      type: (ACTION_TYPES as any).SET_INTEGRATIONS_READ_PERMISSIONS_FULFILLED,
      payload: v1Permissions.integrationsReadPermissions,
    });
  };
