import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';

import {
  loadIntegrationsEndpointsPermissions,
  loadIntegrationsReadPermissions,
  loadOrgAdmin,
  loadWritePermissions,
} from '../redux/user/actions';
import { useKesselRbacAccess } from '../rbac/KesselRbacAccessContext';
import { loadPermissionsFromKessel } from '../redux/user/kesselActions';

interface PermissionsCheckerProps {
  children: React.ReactNode;
}

const PermissionsChecker: React.FC<PermissionsCheckerProps> = ({ children }) => {
  const dispatch = useDispatch<any>();
  const {
    auth: { getUser },
    getUserPermissions,
  } = useChrome();

  // Determine if org is using RBAC v2
  const isV2Org = useFlag('platform.rbac.workspaces');

  // Get Kessel v2 permissions (only used if isV2Org is true)
  const kesselRbacContext = useKesselRbacAccess();
  const { permissions: kesselPermissions, isLoading: isKesselLoading } = kesselRbacContext;

  // Always load org admin status (works for both v1 and v2)
  useEffect(() => {
    dispatch(loadOrgAdmin(getUser));
  }, [getUser, dispatch]);

  // Effect to load sources permissions (always uses v1 Chrome API)
  // Sources service has not migrated to Kessel v2 yet
  useEffect(() => {
    dispatch(loadWritePermissions(getUserPermissions));
  }, [getUserPermissions, dispatch]);

  // Effect to load integrations permissions
  useEffect(() => {
    if (isV2Org && !isKesselLoading) {
      // v2 org: Use Kessel for integrations permissions
      dispatch(loadPermissionsFromKessel(kesselPermissions));
    } else if (!isV2Org) {
      // v1 org: Use Chrome API for integrations permissions
      Promise.all([
        dispatch(loadIntegrationsEndpointsPermissions(getUserPermissions)),
        dispatch(loadIntegrationsReadPermissions(getUserPermissions)),
      ]);
    }
  }, [isV2Org, isKesselLoading, kesselPermissions, getUserPermissions, dispatch]);

  return children;
};

export default PermissionsChecker;
