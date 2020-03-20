import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { EmptyStateSecondaryActions } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateSecondaryActions';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';
import { FormattedMessage } from 'react-intl';

const ErroredStep = ({ onClose, onRetry, message, title }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full }>
            <EmptyStateIcon icon={ TimesCircleIcon } color="var(--pf-global--danger-color--100)" />
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
