import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { Content } from '@patternfly/react-core';

import ErroredStep from '../steps/ErroredStep';

const ErroredModal = ({ onRetry }) => {
  const intl = useIntl();

  return (
    <ErroredStep
      onClose={onRetry}
      customText={intl.formatMessage({
        id: 'sources.editErrorDescription',
        defaultMessage:
          'There was a problem while trying to edit your source. Please try again. If the error persists, open a support case.',
      })}
      secondaryActions={
        <Content
          component="a"
          target="_blank"
          href="https://access.redhat.com/support/cases/#/case/new/open-case?caseCreate=true"
          rel="noopener noreferrer"
        >
          {intl.formatMessage({
            id: 'sources.openTicket',
            defaultMessage: 'Open a support case',
          })}
        </Content>
      }
      returnButtonTitle={intl.formatMessage({
        id: 'sources.retryText',
        defaultMessage: 'Retry',
      })}
    />
  );
};

ErroredModal.propTypes = {
  onRetry: PropTypes.func.isRequired,
};

export default ErroredModal;
