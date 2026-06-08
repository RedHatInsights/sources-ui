import { KesselRbacAccessContextValue } from '../KesselRbacAccessContext';

/**
 * Maps v2 Kessel permissions to v1 Redux user state structure.
 * This allows v2 orgs to use the existing Redux state API without changes to consuming components.
 *
 * Note: Sources permissions are NOT included here - they continue using Chrome API v1
 * until the sources service migrates to Kessel.
 *
 * Permission mapping:
 * - canWriteIntegrationsEndpoints → integrationsEndpointsPermissions (integrations:endpoints:write)
 * - canReadIntegrationsEndpoints → integrationsReadPermissions (integrations:endpoints:read)
 */
export interface V1IntegrationsPermissionsState {
  integrationsEndpointsPermissions: boolean;
  integrationsReadPermissions: boolean;
}

export const mapKesselToV1Permissions = (
  kesselPermissions: KesselRbacAccessContextValue['permissions']
): V1IntegrationsPermissionsState => {
  return {
    // v2: canWriteIntegrationsEndpoints → v1: integrationsEndpointsPermissions
    integrationsEndpointsPermissions: kesselPermissions.canWriteIntegrationsEndpoints,

    // v2: canReadIntegrationsEndpoints → v1: integrationsReadPermissions
    integrationsReadPermissions: kesselPermissions.canReadIntegrationsEndpoints,
  };
};
