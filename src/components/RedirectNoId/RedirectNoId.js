import React from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { addMessage } from '../../redux/actions/providers';

const RedirectNoId = ({ match: { params: { id } }  }) => {
    const intl = useIntl();

    const { loaded, appTypesLoaded, sourceTypesLoaded } = useSelector(({ providers }) => providers, shallowEqual);
    const dispatch = useDispatch();

    const applicationIsLoaded = loaded && appTypesLoaded && sourceTypesLoaded;

    if (applicationIsLoaded) {
        dispatch(addMessage(
            intl.formatMessage({
                id: 'sources.sourceNotFoundTitle',
                defaultMessage: 'Requested source was not found'
            }),
            'danger',
            intl.formatMessage({
                id: 'sources.sourceNotFoundTitleDescription',
                defaultMessage: 'Source with { id } was not found. Try it again later.'
            }, { id })
        ));

        return <Redirect to="/" />;
    }

    return null;
};

RedirectNoId.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            id: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(RedirectNoId);
