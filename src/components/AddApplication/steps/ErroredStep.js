import React from 'react';
import { FormattedMessage  } from 'react-intl';
import { PropTypes } from 'prop-types';

import ErroredStep from '../../steps/ErroredStep';

import { Text, TextVariants } from '@patternfly/react-core/dist/js/components/Text/Text';
import { TextContent } from '@patternfly/react-core/dist/js/components/Text/TextContent';

const ErroredStepAttach = ({ setState, goToSources, error }) => (<ErroredStep
    onClose={goToSources}
    message={
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
    }
    title={<FormattedMessage
        id="sources.configurationSuccessful"
        defaultMessage="Configuration unsuccessful"
    />}
    onRetry={() => setState({ state: 'wizard' })}
/>);

ErroredStepAttach.propTypes = {
    setState: PropTypes.func.isRequired,
    goToSources: PropTypes.func.isRequired,
    error: PropTypes.string.isRequired
};

export default ErroredStepAttach;
