import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import LoadingStep from '../steps/LoadingStep';

const messages = defineMessages({
  sourcesEditsubmittingtitle: {
    id: 'sources.editSubmittingTitle',
    defaultMessage: 'Validating edited source credentials',
  },
});

const SubmittingModal = () => {
  const intl = useIntl();

  return <LoadingStep customText={intl.formatMessage(messages.sourcesEditsubmittingtitle)} />;
};

export default SubmittingModal;
