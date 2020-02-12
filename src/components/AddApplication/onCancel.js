import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
    clearAddSource,
    addMessage
} from '../../redux/sources/actions';
import UndoButtonAdd from '../../components/UndoButton/UndoButtonAdd';
import { routes, replaceRouteId } from '../../Routes';

export const onCancelAddApplication = ({ values, dispatch, history, intl, sourceId }) => {
    if (values && values.application) {
        const messageId = Date.now();
        dispatch(addMessage(
            intl.formatMessage({
                id: 'sources.addApplicationCanceled',
                defaultMessage: 'Adding an application was cancelled'
            }),
            'success',
            <FormattedMessage
                id="sources.undoMistake"
                defaultMessage={ `{undo} if this was a mistake.` }
                values={ { undo: <UndoButtonAdd
                    messageId={messageId}
                    values={values}
                    path={replaceRouteId(routes.sourceManageApps.path, sourceId)}
                /> } }
            />,
            messageId
        ));
    }

    dispatch(clearAddSource());
    history.push(routes.sources.path);
};
