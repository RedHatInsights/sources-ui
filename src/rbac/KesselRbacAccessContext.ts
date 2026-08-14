import { createContext, useContext } from 'react';

/**
 * Context for Kessel v2 RBAC access checks.
 * Provides workspace ID and permission check results for all relations.
 */
export interface KesselRbacAccessContextValue {
  /**
   * Default workspace ID from /api/rbac/v2/workspaces/?type=default
   */
  workspaceId: string | undefined;

  /**
   * Whether the workspace and permissions are still loading
   */
  isLoading: boolean;

  /**
   * Permission check results
   * Note: Sources permissions continue using Chrome API v1 until sources service migrates to Kessel
   */
  permissions: {
    // Integrations permissions
    canWriteIntegrationsEndpoints: boolean;
    canReadIntegrationsEndpoints: boolean;
  };

  /**
   * Errors encountered during workspace or permission fetching
   */
  errors: Error[];
}

export const KesselRbacAccessContext = createContext<KesselRbacAccessContextValue | undefined>(undefined);

/**
 * Hook to access Kessel RBAC context.
 * @throws if used outside KesselRbacAccessProvider
 */
export const useKesselRbacAccess = (): KesselRbacAccessContextValue => {
  const context = useContext(KesselRbacAccessContext);
  if (!context) {
    throw new Error('useKesselRbacAccess must be used within KesselRbacAccessProvider');
  }

  return context;
};
