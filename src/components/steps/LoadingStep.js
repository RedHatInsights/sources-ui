import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { EmptyStateSecondaryActions } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateSecondaryActions';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';

import { Spinner } from '@redhat-cloud-services/frontend-components';
import { FormattedMessage } from 'react-intl';

const LoadingStep = ({ onClose, customText }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full }>
            <div>
                <Spinner />
            </div>
            <EmptyStateBody>
                { customText }
            </EmptyStateBody>
            { onClose &&
        <EmptyStateSecondaryActions>
            <Button variant="link" onClick={ onClose }>
                <FormattedMessage
                    id="sources.cancel"
                    defaultMessage="Cancel"
                />
            </Button>
        </EmptyStateSecondaryActions> }
        </EmptyState>
    </Bullseye>
);

LoadingStep.propTypes = {
    onClose: PropTypes.func,
    customText: PropTypes.node
};

LoadingStep.defaultProps = {
    customText: <FormattedMessage
        id="sources.loading"
        defaultMessage="Loading, please wait."
    />
};

export default LoadingStep;
