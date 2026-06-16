import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
import { useFlag } from '@unleash/proxy-client-react';
import { ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AppDispatch = ThunkDispatch<any, unknown, AnyAction>;

const PermissionsChecker: React.FC<PermissionsCheckerProps> = ({ children }) => {
  const dispatch = useDispatch<AppDispatch>();
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

  // Effect to load v1 integrations permissions (for v1 orgs only)
  useEffect(() => {
    if (!isV2Org) {
      Promise.all([
        dispatch(loadIntegrationsEndpointsPermissions(getUserPermissions)),
        dispatch(loadIntegrationsReadPermissions(getUserPermissions)),
      ]);
    }
  }, [isV2Org, getUserPermissions, dispatch]);

  // Effect to load integrations permissions for v2 orgs (Kessel + v1 fallback)
  useEffect(() => {
    if (isV2Org && !isKesselLoading) {
      // v2 org: Use Kessel for integrations permissions AND load v1 for wildcard fallback
      // Kessel v2 does not support wildcard expansion, so we must check v1 wildcards
      // (integrations:*:*, notifications:*:*) as fallback for Org Admins and legacy roles.
      // See: https://github.com/RedHatInsights/insights-chrome/pull/3362
      dispatch(loadPermissionsFromKessel(kesselPermissions));
      // Also load v1 permissions for wildcard fallback
      Promise.all([
        dispatch(loadIntegrationsEndpointsPermissions(getUserPermissions)),
        dispatch(loadIntegrationsReadPermissions(getUserPermissions)),
      ]);
    }
  }, [isV2Org, isKesselLoading, kesselPermissions, getUserPermissions, dispatch]);

  return children;
};

export default PermissionsChecker;
