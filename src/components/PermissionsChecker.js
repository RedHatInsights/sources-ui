import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadWritePermissions } from '../redux/user/actions';

const PermissionsChecker = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadWritePermissions());
  }, []);

  return children;
};

export default PermissionsChecker;
