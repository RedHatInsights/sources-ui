import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { loadOrgAdmin } from '../redux/user/actions';

const PermissionsChecker = ({ children }) => {
    const intl = useIntl();
    const dispatch = useDispatch();

    useEffect(() => {
        const title = intl.formatMessage({
            id: 'sources.notOrgAdmTitle',
            defaultMessage: 'Read access only'
        });
        const description = intl.formatMessage({
            id: 'sources.notOrgAdmDesc',
            defaultMessage: 'You have to be an organisation admin to get a write access to Sources'
        });
        dispatch(loadOrgAdmin(title, description));
    }, []);

    return children;
};

export default PermissionsChecker;
