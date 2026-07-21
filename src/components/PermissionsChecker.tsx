import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';
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

  const { permissions: kesselPermissions, isLoading: isKesselLoading, workspaceId } = useKesselRbacAccess();

  useEffect(() => {
    dispatch(loadOrgAdmin(getUser));
  }, [getUser, dispatch]);

  useEffect(() => {
    dispatch(loadWritePermissions(getUserPermissions));
  }, [getUserPermissions, dispatch]);

  useEffect(() => {
    Promise.all([
      dispatch(loadIntegrationsEndpointsPermissions(getUserPermissions)),
      dispatch(loadIntegrationsReadPermissions(getUserPermissions)),
    ]);
  }, [getUserPermissions, dispatch]);

  // Dispatch Kessel v2 results only when a workspace was resolved — if the workspace
  // fetch failed (no Kessel in this environment), Kessel has no signal to contribute
  // and the v1 Chrome API results above are authoritative.
  useEffect(() => {
    if (!isKesselLoading && workspaceId) {
      dispatch(loadPermissionsFromKessel(kesselPermissions));
    }
  }, [isKesselLoading, workspaceId, kesselPermissions, dispatch]);

  return children;
};

export default PermissionsChecker;
