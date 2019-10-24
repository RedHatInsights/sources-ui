import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { addMessage } from '../../redux/actions/providers';

const RedirectNoId = ({ loaded, intl, sourceId, addMessage }) => {
    if (loaded) {
        addMessage(
            intl.formatMessage({
                id: 'sources.sourceNotFoundTitle',
                defaultMessage: 'Requested source was not found'
            }),
            'danger',
            intl.formatMessage({
                id: 'sources.sourceNotFoundTitleDescription',
                defaultMessage: 'Source with { id } was not found. Try it again later.'
            }, { id: sourceId })
        );

        return <Redirect to="/" />;
    }

    return null;
};

RedirectNoId.propTypes = {
    intl: PropTypes.shape({
        formatMessage: PropTypes.func.isRequired
    }).isRequired,
    sourceId: PropTypes.string.isRequired,
    loaded: PropTypes.bool,
    addMessage: PropTypes.func.isRequired
};

const mapStateToProps = ({ providers: { loaded } }, { match: { params: { id } } }) =>
    ({ loaded, sourceId: id });

const mapDispatchToProps = (dispatch) => bindActionCreators({ addMessage }, dispatch);

export default injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(RedirectNoId)));
