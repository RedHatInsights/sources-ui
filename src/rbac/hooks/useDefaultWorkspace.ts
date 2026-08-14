import { useEffect, useState } from 'react';
import { type Workspace, fetchDefaultWorkspace } from '@project-kessel/react-kessel-access-check';

/**
 * Hook to fetch and cache the default workspace ID.
 * Provides a similar API to useDefaultWorkspace from future versions of @project-kessel/react-kessel-access-check.
 */
export const useDefaultWorkspace = () => {
  const [workspaceId, setWorkspaceId] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>(undefined);

  useEffect(() => {
    let isMounted = true;

    const fetchWorkspace = async () => {
      try {
        // Use the current origin as the RBAC base endpoint
        // In console.redhat.com, this will be the same origin
        const rbacBaseEndpoint = window.location.origin;

        const workspace: Workspace = await fetchDefaultWorkspace(rbacBaseEndpoint);

        if (isMounted) {
          setWorkspaceId(workspace.id);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to fetch default workspace'));
          setIsLoading(false);
        }
      }
    };

    fetchWorkspace();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    workspaceId,
    isLoading,
    error,
  };
};
