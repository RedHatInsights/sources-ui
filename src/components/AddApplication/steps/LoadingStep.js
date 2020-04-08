import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { EmptyStateSecondaryActions } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateSecondaryActions';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { Spinner } from '@patternfly/react-core/dist/js/components/Spinner';
import { Progress } from '@patternfly/react-core/dist/js/components/Progress/Progress';

import { FormattedMessage } from 'react-intl';

const LoadingStep = ({ onClose, customText, progressStep, progressTexts }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state">
            <EmptyStateIcon icon={ Spinner } color="var(--pf-global--success-color--100)" />
            <EmptyStateBody>
                {progressTexts ?
                    <Progress
                        value={progressStep}
                        min={0}
                        max={progressTexts.length - 1}
                        title=" "
                        label={progressTexts[progressStep]}
                        valueText={progressTexts[progressStep]}
                        className="pf-u-mb-md ins-c-sources__progress"
                    />
                    : customText
                }
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
    customText: PropTypes.node,
    progressStep: PropTypes.number,
    progressTexts: PropTypes.arrayOf(PropTypes.string)
};

LoadingStep.defaultProps = {
    customText: <FormattedMessage
        id="sources.loading"
        defaultMessage="Loading, please wait."
    />
};

export default LoadingStep;
