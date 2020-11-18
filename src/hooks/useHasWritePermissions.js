import { useSelector } from 'react-redux';

export const useHasWritePermissions = () => {
  const { orgAdmin, writePermissions } = useSelector(({ user }) => ({
    orgAdmin: user?.isOrgAdmin,
    writePermissions: user?.writePermissions,
  }));

  if (typeof orgAdmin !== 'boolean' && typeof writePermissions !== 'boolean') {
    return undefined;
  }

  return !!orgAdmin || !!writePermissions;
};
