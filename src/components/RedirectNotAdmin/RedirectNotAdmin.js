import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { addMessage } from '../../redux/sources/actions';
import { useIsOrgAdmin } from '../../hooks/useIsOrgAdmin';
import { routes } from '../../Routes';

const RedirectNotAdmin = () => {
    const intl = useIntl();

    const isOrgAdmin = useIsOrgAdmin();

    const dispatch = useDispatch();

    useEffect(() => {
        if (isOrgAdmin === false) {
            const title = intl.formatMessage({
                id: 'sources.insufficietnPerms',
                defaultMessage: 'Insufficient permissions'
            });
            const description = intl.formatMessage({
                id: 'sources.notAdminButton',
                defaultMessage: 'You do not have permission to perform this action.'
            });

            dispatch(addMessage(
                title,
                'danger',
                description
            ));
        }
    }, []);

    if (isOrgAdmin === false) {
        return <Redirect to={routes.sources.path} />;
    }

    return null;
};

export default RedirectNotAdmin;
