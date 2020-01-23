import { useEffect } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import { addMessage } from '../redux/sources/actions';

const PermissionsChecker = ({ children }) => {
    const intl = useIntl();
    const dispatch = useDispatch();

    useEffect(() => {
        insights.chrome.auth.getUser().then((user) => {
            if (!user.identity.user.is_org_admin) {
                dispatch(addMessage(
                    intl.formatMessage({
                        id: 'sources.notOrgAdmTitle',
                        defaultMessage: 'Insufficient permissions'
                    }),
                    'danger',
                    intl.formatMessage({
                        id: 'sources.notOrgAdmDesc',
                        defaultMessage: 'You have to be an organisation admin to get an access to Sources'
                    })
                ));
            }
        });
    }, []);

    return children;
};

export default PermissionsChecker;
