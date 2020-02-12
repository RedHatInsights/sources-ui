import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { EmptyStateSecondaryActions } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateSecondaryActions';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';

import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';
import { FormattedMessage } from 'react-intl';

const FinishedStep = ({ onClose, title, successfulMessage, secondaryActions }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full }>
            <EmptyStateIcon icon={ CheckCircleIcon } color="var(--pf-global--success-color--100)" />
            <Title headingLevel="h5" size="lg">
                { title }
            </Title>
            <EmptyStateBody>
                { successfulMessage }
            </EmptyStateBody>
            <Button variant="primary" onClick={ onClose }>
                <FormattedMessage
                    id="sources.backToSources"
                    defaultMessage="Back to Sources"
                />
            </Button>
            {  secondaryActions && <EmptyStateSecondaryActions>
                { secondaryActions }
            </EmptyStateSecondaryActions> }
        </EmptyState>
    </Bullseye>
);

FinishedStep.propTypes = {
    onClose: PropTypes.func.isRequired,
    successfulMessage: PropTypes.node.isRequired,
    title: PropTypes.node.isRequired,
    secondaryActions: PropTypes.node
};

export default FinishedStep;
