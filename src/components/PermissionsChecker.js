import { useEffect } from 'react';
import { useDispatch, batch } from 'react-redux';

import { loadOrgAdmin, loadWritePermissions } from '../redux/user/actions';

const PermissionsChecker = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    batch(() => {
      dispatch(loadOrgAdmin());
      dispatch(loadWritePermissions());
    });
  }, []);

  return children;
};

export default PermissionsChecker;
