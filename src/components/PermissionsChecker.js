import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

import { loadOrgAdmin, loadWritePermissions } from '../redux/user/actions';

const PermissionsChecker = ({ children }) => {
  const dispatch = useDispatch();
  const {
    auth: { getUser },
    getUserPermissions,
  } = useChrome();

  useEffect(() => {
    Promise.all([dispatch(loadWritePermissions(getUserPermissions)), dispatch(loadOrgAdmin(getUser))]);
  }, []);

  return children;
};

export default PermissionsChecker;
