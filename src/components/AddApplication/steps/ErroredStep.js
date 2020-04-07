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

import TimesCircleIcon from '@patternfly/react-icons/dist/js/icons/times-circle-icon';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

const ErroredStepAttach = ({ onReset, goToSources, error, progressStep, progressTexts }) => (
    <Bullseye>
        <EmptyState variant={ EmptyStateVariant.full } className="ins-c-sources__empty-state">
            <EmptyStateIcon icon={ TimesCircleIcon } color="var(--pf-global--danger-color--100)" />
            <Title headingLevel="h5" size="lg">
                <FormattedMessage
                    id="sources.configurationSuccessful"
                    defaultMessage="Configuration unsuccessful"
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
                    variant='danger'
                />
                <React.Fragment>
                    <FormattedMessage
                        id="sources.successAddApp"
                        defaultMessage="Your application has not been successfully added:"
                    />
                    <br />
                    <TextContent>
                        <Text component={TextVariants.h6}>{ error }</Text>
                    </TextContent>
                </React.Fragment>
            </EmptyStateBody>
            <Button variant="primary" onClick={ goToSources }>
                <FormattedMessage
                    id="sources.backToSources"
                    defaultMessage="Back to Sources"
                />
            </Button>
            { onReset && <EmptyStateSecondaryActions>
                <Button variant="link" onClick={ onReset }>
                    <FormattedMessage
                        id="sources.retry"
                        defaultMessage="Retry"
                    />
                </Button>
            </EmptyStateSecondaryActions>}
        </EmptyState>
    </Bullseye>
);

ErroredStepAttach.propTypes = {
    onReset: PropTypes.func.isRequired,
    goToSources: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired,
    progressStep: PropTypes.number.isRequired,
    progressTexts: PropTypes.arrayOf(PropTypes.string).isRequired
};

export default ErroredStepAttach;
