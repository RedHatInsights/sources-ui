import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { Modal } from '@patternfly/react-core/dist/js/components/Modal';
import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { Split } from '@patternfly/react-core/dist/js/layouts/Split/Split';
import { SplitItem } from '@patternfly/react-core/dist/js/layouts/Split/SplitItem';
import { Stack } from '@patternfly/react-core/dist/js/layouts/Stack/Stack';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/js/icons/exclamation-triangle-icon';

import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch } from 'react-redux';

import sourceEditContext from '../sourceEditContext';
import { addMessage } from '../../../redux/sources/actions';
import { doDeleteAuthentication } from '../../../api/entities';
import { handleError } from '@redhat-cloud-services/frontend-components-sources';

const RemoveAuth = ({ onClose, appNames, schemaAuth, auth }) => {
    const hasAttachedApp = appNames.length > 0;
    let body;
    let actions;

    const dispatch = useDispatch();
    const intl = useIntl();

    const { setState } = useContext(sourceEditContext);

    const onRemove = () => {
        setState({ type: 'removeAuthPending', authId: auth.id });
        onClose();
        return doDeleteAuthentication(auth.id).then(() => {
            setState({ type: 'removeAuthFulfill', authId: auth.id });
            dispatch(addMessage(
                intl.formatMessage(
                    { id: 'sources.authRemoveFullfil', defaultMessage: 'Authentication was deleted successfully.' }
                ),
                'success'
            ));
        })
        .catch((error) => {
            setState({ type: 'removeAuthRejected', authId: auth.id });
            dispatch(addMessage(
                intl.formatMessage(
                    { id: 'sources.authRemoveRejected', defaultMessage: 'Authentication was not deleted successfully.' }
                ),
                'danger',
                handleError(error)
            ));
        });
    };

    if (hasAttachedApp) {
        body = (<FormattedMessage
            id="sources.removeAuthWarningApps"
            defaultMessage="To remove this authentication you have to remove attached
            {count, plural, one {application} other {applications}}: { appNames }."
            values={{ appNames: appNames.join(', '), count: appNames.length }}
        />);
        actions = [<Button
            id="deleteCancel"
            key="cancel"
            variant="link"
            type="button"
            onClick={ onClose }
        >
            <FormattedMessage
                id="sources.close"
                defaultMessage="Close"
            />
        </Button>];
    } else {
        body = (<FormattedMessage
            id="sources.removeAuthWarning"
            defaultMessage="Do you really want to remove this authentication?"
        />);
        actions = [<Button
            id="deleteSubmit"
            key="submit"
            variant="danger"
            type="button"
            onClick={ onRemove }
        >
            <FormattedMessage
                id="sources.deleteConfirm"
                defaultMessage="Delete this authentication"
            />
        </Button>,
        <Button
            id="deleteCancel"
            key="cancel"
            variant="link"
            type="button"
            onClick={ onClose }
        >
            <FormattedMessage
                id="sources.deleteCancel"
                defaultMessage="Do not delete this authentication"
            />
        </Button>];
    }

    return (
        <Modal
            isOpen
            className="ins-c-sources__dialog--warning"
            isFooterLeftAligned
            onClose={onClose}
            actions={actions}
            isSmall
            title={intl.formatMessage(
                { id: 'sources.deleteAuthTitle', defaultMessage: 'Delete { name }' },
                { name: schemaAuth.name })
            }
        >
            <Split gutter="md">
                <SplitItem>
                    <ExclamationTriangleIcon size="xl" className="ins-m-alert ins-c-source__delete-icon" />
                </SplitItem>
                <SplitItem isFilled>
                    <Stack gutter="md">
                        <TextContent>
                            <Text variant={TextVariants.p}>
                                {body}
                            </Text>
                        </TextContent>
                    </Stack>
                </SplitItem>
            </Split>
        </Modal>
    );
};

RemoveAuth.propTypes = {
    onClose: PropTypes.func.isRequired,
    appNames: PropTypes.arrayOf(PropTypes.string),
    schemaAuth: PropTypes.shape({
        name: PropTypes.string.isRequired
    }).isRequired,
    auth: PropTypes.shape({
        id: PropTypes.string.isRequired
    }).isRequired
};

export default RemoveAuth;
