import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import { removeMessage, undoValues } from '../../redux/sources/actions';
import { routes } from '../../Routes';
import { refreshPage } from './refreshPage';

const UndoButton = ({ messageId, values, path }) => {
    const history = useHistory();
    const dispatch = useDispatch();
    const notifications = useSelector(({ notifications }) => notifications);

    return (
        <Button variant="link" isInline onClick={() => {
            const notification = notifications.find(({ customId }) => customId === messageId);

            if (notification) {
                dispatch(removeMessage(notification.id));
            }

            dispatch(undoValues(values));

            const isOnWizard = history.location.pathname === path;

            if (isOnWizard) {
                refreshPage(history);
            } else {
                history.push(path);
            }
        }}>
            <FormattedMessage
                id="sources.undo"
                defaultMessage="Undo"
            />
        </Button>
    );};

UndoButton.propTypes = {
    messageId: PropTypes.number.isRequired,
    values: PropTypes.object.isRequired,
    path: PropTypes.string
};

UndoButton.defaultProps = {
    path: routes.sourcesNew.path
};

export default UndoButton;
