import React, { useEffect, useMemo, useState } from 'react';
import { useSelfAccessCheck } from '@project-kessel/react-kessel-access-check';
import { KesselRbacAccessContext, KesselRbacAccessContextValue } from './KesselRbacAccessContext';
import { KESSEL_WORKSPACE_RELATIONS } from './kesselWorkspaceRelations';
import { useDefaultWorkspace } from './hooks/useDefaultWorkspace';

/**
 * Provider that fetches the default workspace and checks all Kessel v2 permissions.
 * Wraps children with KesselRbacAccessContext to expose workspace ID and permission results.
 *
 * Usage:
 * ```tsx
 * import { AccessCheck } from '@project-kessel/react-kessel-access-check';
 *
 * <AccessCheck.Provider baseUrl={window.location.origin} apiPath="/api/kessel/v1beta2">
 *   <KesselRbacAccessProvider>
 *     <App />
 *   </KesselRbacAccessProvider>
 * </AccessCheck.Provider>
 * ```
 */
export const KesselRbacAccessProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [errors, setErrors] = useState<Error[]>([]);

  // Fetch the default workspace ID
  const { workspaceId: defaultWorkspaceId, isLoading: isLoadingWorkspace, error: workspaceError } = useDefaultWorkspace();

  // Track workspace errors
  useEffect(() => {
    if (workspaceError) {
      setErrors((prev) => [...prev, workspaceError]);
    }
  }, [workspaceError]);

  // Build workspace resource for permission checks
  const workspace = useMemo(
    () => ({
      id: defaultWorkspaceId || '',
      type: 'workspace' as const,
      reporter: { type: 'rbac' as const },
    }),
    [defaultWorkspaceId],
  );

  // Permission checks - using v0.5.0 API which returns { loading, error, data }
  // Note: Only checking integrations permissions - sources continues using Chrome API v1
  const integrationsEndpointsEdit = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_EDIT,
    resource: workspace,
  });

  const integrationsEndpointsView = useSelfAccessCheck({
    relation: KESSEL_WORKSPACE_RELATIONS.INTEGRATIONS_ENDPOINTS_VIEW,
    resource: workspace,
  });

  // Track permission check errors
  useEffect(() => {
    const permissionErrors: Error[] = [];
    if (integrationsEndpointsEdit.error) {
      permissionErrors.push(new Error(`Integrations endpoints edit check failed: ${integrationsEndpointsEdit.error.message}`));
    }

    if (integrationsEndpointsView.error) {
      permissionErrors.push(new Error(`Integrations endpoints view check failed: ${integrationsEndpointsView.error.message}`));
    }

    if (permissionErrors.length > 0) {
      setErrors((prev) => [...prev, ...permissionErrors]);
    }
  }, [integrationsEndpointsEdit.error, integrationsEndpointsView.error]);

  // Aggregate loading states
  const isLoading = isLoadingWorkspace || integrationsEndpointsEdit.loading || integrationsEndpointsView.loading;

  // Build context value
  const contextValue: KesselRbacAccessContextValue = useMemo(
    () => ({
      workspaceId: defaultWorkspaceId,
      isLoading,
      permissions: {
        // Only grant permissions if workspace is loaded and check returned allowed=true
        canWriteIntegrationsEndpoints: !!defaultWorkspaceId && (integrationsEndpointsEdit.data?.allowed ?? false),
        canReadIntegrationsEndpoints: !!defaultWorkspaceId && (integrationsEndpointsView.data?.allowed ?? false),
      },
      errors,
    }),
    [defaultWorkspaceId, isLoading, integrationsEndpointsEdit.data?.allowed, integrationsEndpointsView.data?.allowed, errors],
  );

  return <KesselRbacAccessContext.Provider value={contextValue}>{children}</KesselRbacAccessContext.Provider>;
};
