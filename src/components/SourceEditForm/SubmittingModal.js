import React from 'react';
import { useIntl } from 'react-intl';

import LoadingStep from '@redhat-cloud-services/frontend-components-sources/cjs/LoadingStep';

const SubmittingModal = () => {
  const intl = useIntl();

  return (
    <LoadingStep
      customText={intl.formatMessage({
        id: 'sources.editSubmittingTitle',
        defaultMessage: 'Validating edited source credentials',
      })}
    />
  );
};

export default SubmittingModal;
