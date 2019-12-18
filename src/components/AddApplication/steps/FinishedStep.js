import React from 'react';
import { FormattedMessage  } from 'react-intl';
import { PropTypes } from 'prop-types';
import { Button } from '@patternfly/react-core';

import FinishedStep from '../../steps/FinishedStep';

const FinishedStepAttach = ({ setState, goToSources }) => (
    <FinishedStep
        onClose={goToSources}
        successfulMessage={<FormattedMessage
            id="sources.successAddApp"
            defaultMessage="Your application has been successfully added."
        />}
        title={<FormattedMessage
            id="sources.configurationSuccessful"
            defaultMessage="Configuration successful"
        />}
        secondaryActions={
            <Button variant="link" onClick={() => setState({ values: {}, state: 'wizard' })}>
                <FormattedMessage
                    id="sources.continueManageApp"
                    defaultMessage="Continue managing applications"
                />
            </Button>
        }
    />
);

FinishedStepAttach.propTypes = {
    setState: PropTypes.func.isRequired,
    goToSources: PropTypes.func.isRequired
};

export default FinishedStepAttach;
