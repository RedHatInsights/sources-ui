import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { removeMessage, undoAddSource } from '../../redux/actions/providers';
import { paths } from '../../Routes';
import { refreshPage } from './refreshPage';

const UndoButton = ({
    notifications,
    messageId,
    history,
    removeMessage,
    values,
    undoAddSource
}) => (
    <Button variant="link" isInline onClick={() => {
        const notification = notifications.find(({ customId }) => customId === messageId);

        if (notification) {
            removeMessage(notification.id);
        }

        undoAddSource(values);

        const isOnWizard = history.location.pathname === paths.sourcesNew;

        if (isOnWizard) {
            refreshPage(history);
        } else {
            history.push(paths.sourcesNew);
        }
    }}>
        <FormattedMessage
            id="sources.undo"
            defaultMessage="Undo"
        />
    </Button>
);

UndoButton.propTypes = {
    notifications: PropTypes.arrayOf(PropTypes.shape({
        customId: PropTypes.number.isRequired,
        id: PropTypes.string.isRequired
    })),
    history: PropTypes.any.isRequired,
    messageId: PropTypes.number.isRequired,
    removeMessage: PropTypes.func.isRequired,
    values: PropTypes.object.isRequired,
    undoAddSource: PropTypes.func.isRequired
};

const mapDispatchToProps = dispatch => bindActionCreators({ removeMessage, undoAddSource },  dispatch);

const mapStateToProps = ({ notifications }) => ({ notifications });

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(UndoButton));
