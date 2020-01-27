import { useSelector } from 'react-redux';

export const useIsOrgAdmin = () => {
    const isOrgAdmin = useSelector(({ user }) => user.isOrgAdmin);

    return isOrgAdmin;
};
