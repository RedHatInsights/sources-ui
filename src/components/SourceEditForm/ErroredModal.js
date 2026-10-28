import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Content } from '@patternfly/react-core';

import ErroredStep from '../steps/ErroredStep';

const messages = defineMessages({
  sourcesEditerrordescription: {
    id: 'sources.editErrorDescription',
    defaultMessage:
      'There was a problem while trying to edit your source. Please try again. If the error persists, open a support case.',
  },
  sourcesOpenticket: {
    id: 'sources.openTicket',
    defaultMessage: 'Open a support case',
  },
  sourcesRetrytext: {
    id: 'sources.retryText',
    defaultMessage: 'Retry',
  },
});

const ErroredModal = ({ onRetry }) => {
  const intl = useIntl();

  return (
    <ErroredStep
      onClose={onRetry}
      customText={intl.formatMessage(messages.sourcesEditerrordescription)}
      secondaryActions={
        <Content
          component="a"
          target="_blank"
          href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
          rel="noopener noreferrer"
        >
          {intl.formatMessage(messages.sourcesOpenticket)}
        </Content>
      }
      returnButtonTitle={intl.formatMessage(messages.sourcesRetrytext)}
    />
  );
};

ErroredModal.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default ErroredModal;
