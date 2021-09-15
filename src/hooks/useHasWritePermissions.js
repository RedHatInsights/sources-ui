import { useSelector } from 'react-redux';

export const useHasWritePermissions = () => {
  const writePermissions = useSelector(({ user }) => user?.writePermissions);

  if (typeof writePermissions !== 'boolean') {
    return undefined;
  }

  return !!writePermissions;
};
