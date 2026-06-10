/**
 * Kessel workspace relations for integrations permissions.
 * Based on rbac-config notifications.ksl.
 * @see https://github.com/RedHatInsights/rbac-config/blob/master/configs/prod/schemas/src/notifications.ksl
 *
 * v1 permission → v2 relation mapping:
 * - integrations:endpoints:write → integrations_endpoints_edit
 * - integrations:endpoints:read → integrations_endpoints_view
 *
 * Note: Sources permissions continue using Chrome API v1 until the sources service migrates to Kessel.
 * They are NOT included in this mapping.
 */
export const KESSEL_WORKSPACE_RELATIONS = {
  // Integrations app permissions (confirmed from notifications.ksl)
  INTEGRATIONS_ENDPOINTS_EDIT: 'integrations_endpoints_edit',
  INTEGRATIONS_ENDPOINTS_VIEW: 'integrations_endpoints_view',
} as const;

/**
 * Ordered array of all relations for bulk checking
 */
export const KESSEL_WORKSPACE_RELATIONS_ORDERED = [
  KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_EDIT,
  KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_VIEW,
] as const;

export type KesselWorkspaceRelation = (typeof KESSEL_WORKSPACE_RELATIONS_ORDERED)[number];
