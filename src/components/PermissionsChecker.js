import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadOrgAdmin, loadWritePermissions } from '../redux/user/actions';

const PermissionsChecker = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrgAdmin());
    dispatch(loadWritePermissions());
  }, []);

  return children;
};

export default PermissionsChecker;
