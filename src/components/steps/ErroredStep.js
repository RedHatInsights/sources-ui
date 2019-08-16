import React from 'react';
import PropTypes from 'prop-types';
import {
    EmptyStateBody,
    EmptyState,
    EmptyStateIcon,
    Title, Button,
    EmptyStateSecondaryActions,
    EmptyStateVariant,
    Bullseye
} from '@patternfly/react-core';
import { ErrorCircleOIcon } from '@patternfly/react-icons';
import { FormattedMessage } from 'react-intl';

const ErroredStep = ({ onClose, onRetry, message, title }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full }>
            <EmptyStateIcon icon={ ErrorCircleOIcon } color="var(--pf-global--danger-color--100)" />
            <Title headingLevel="h5" size="lg">
                { title }
            </Title>
            <EmptyStateBody>
                { message }
            </EmptyStateBody>
            <Button variant="primary" onClick={ onClose }>
                <FormattedMessage
                    id="sources.backToSources"
                    defaultMessage="Back to Sources"
                />
            </Button>
            { onRetry && <EmptyStateSecondaryActions>
                <Button variant="link" onClick={ onRetry }>
                    <FormattedMessage
                        id="sources.retry"
                        defaultMessage="Retry"
                    />
                </Button>
            </EmptyStateSecondaryActions>}
        </EmptyState>
    </Bullseye>
);

ErroredStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    message: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    onRetry: PropTypes.func
};

export default ErroredStep;
