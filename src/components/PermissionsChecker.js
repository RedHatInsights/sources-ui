import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { loadOrgAdmin } from '../redux/user/actions';

const PermissionsChecker = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadOrgAdmin());
  }, []);

  return children;
};

export default PermissionsChecker;
