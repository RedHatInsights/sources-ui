import React from 'react';
import { useDispatch } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { addMessage } from '../../redux/sources/actions';
import { useIsOrgAdmin } from '../../hooks/useIsOrgAdmin';

const RedirectNotAdmin = () => {
    const intl = useIntl();

    const isOrgAdmin = useIsOrgAdmin();

    const dispatch = useDispatch();

    if (isOrgAdmin === false) {
        const title = intl.formatMessage({
            id: 'sources.insufficietnPerms',
            defaultMessage: 'Insufficient permissions'
        });
        const description = intl.formatMessage({
            id: 'sources.insufficietnPermsDesc',
            defaultMessage: 'You have to be an organisation admin to be able to do this action'
        });

        dispatch(addMessage(
            title,
            'danger',
            description
        ));
        return <Redirect to="/" />;
    }

    return null;
};

export default RedirectNotAdmin;
