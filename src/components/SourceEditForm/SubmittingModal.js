import React from 'react';
import { useIntl } from 'react-intl';

import LoadingStep from '@redhat-cloud-services/frontend-components-sources/cjs/LoadingStep';

import WrapperModal from './WrapperModal';

const SubmittingModal = () => {
  const intl = useIntl();

  return (
    <WrapperModal>
      <LoadingStep
        customText={intl.formatMessage({
          id: 'sources.editSubmittingTitle',
          defaultMessage: 'Validating edited source credentials',
        })}
      />
    </WrapperModal>
  );
};

export default SubmittingModal;
