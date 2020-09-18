import React from 'react';
import { useIntl } from 'react-intl';

import { Text } from '@patternfly/react-core/dist/js/components/Text/Text';

import ErroredStep from '@redhat-cloud-services/frontend-components-sources/cjs/ErroredStep';

import WrapperModal from './WrapperModal';

const ErroredModal = () => {
    const intl = useIntl();

    return (
        <WrapperModal>
            <ErroredStep
                primaryAction={console.log('reset')}
                customText={
                    intl.formatMessage({
                        id: 'sources.editErrorDescription',
                        // eslint-disable-next-line max-len
                        defaultMessage: 'There was a problem while trying to edit your source. Please try again. If the error persists, open a support case.'
                    })
                }
                secondaryActions={
                    <Text
                        component='a'
                        target="_blank"
                        href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
                        rel="noopener noreferrer"
                    >
                        {intl.formatMessage({ id: 'sources.openTicket', defaultMessage: 'Open a support case' })}
                    </Text>
                }
                returnButtonTitle={ intl.formatMessage({
                    id: 'sources.retryText',
                    defaultMessage: 'Retry'
                })}
            />
        </WrapperModal>
    );
};

export default ErroredModal;
