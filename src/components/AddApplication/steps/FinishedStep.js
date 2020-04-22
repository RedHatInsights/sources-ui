import React from 'react';
import { FormattedMessage  } from 'react-intl';
import { PropTypes } from 'prop-types';
import { Button } from '@patternfly/react-core/dist/js/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateBody';
import { EmptyStateSecondaryActions } from '@patternfly/react-core/dist/js/components/EmptyState/EmptyStateSecondaryActions';
import { Bullseye } from '@patternfly/react-core/dist/js/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/js/components/Title/Title';
import { Progress } from '@patternfly/react-core/dist/js/components/Progress/Progress';

import CheckCircleIcon from '@patternfly/react-icons/dist/js/icons/check-circle-icon';

const FinishedStepAttach = ({ goToSources, onReset, progressStep, progressTexts }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state">
            <EmptyStateIcon icon={ CheckCircleIcon } color="var(--pf-global--success-color--100)" />
            <Title headingLevel="h5" size="lg">
                <FormattedMessage
                    id="sources.configurationSuccessful"
                    defaultMessage="Configuration successful"
                />
            </Title>
            <EmptyStateBody>
                <Progress
                    className="pf-u-mb-md ins-c-sources__progress"
                    value={progressStep}
                    min={0}
                    title=" "
                    max={progressTexts.length - 1}
                    label={progressTexts[progressStep]}
                    valueText={progressTexts[progressStep]}
                    variant='success'
                />
                <FormattedMessage
                    id="sources.successAddApp"
                    defaultMessage="Your application has been successfully added."
                />
            </EmptyStateBody>
            <Button variant="primary" onClick={ goToSources }>
                <FormattedMessage
                    id="sources.backToSources"
                    defaultMessage="Back to Sources"
                />
            </Button>
            <EmptyStateSecondaryActions>
                <Button variant="link" onClick={onReset}>
                    <FormattedMessage
                        id="sources.continueManageApp"
                        defaultMessage="Continue managing applications"
                    />
                </Button>
            </EmptyStateSecondaryActions>
        </EmptyState>
    </Bullseye>
);

FinishedStepAttach.propTypes = {
    onReset: PropTypes.func.isRequired,
    goToSources: PropTypes.func.isRequired,
    progressStep: PropTypes.number.isRequired,
    progressTexts: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default FinishedStepAttach;
