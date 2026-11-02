import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages } from 'react-intl';

const messages = defineMessages({
  wizardLoadingtext: {
    id: 'wizard.loadingStepText',
    defaultMessage: 'Loading, please wait.',
  },
  wizardCanceltext: {
    id: 'wizard.cancelText',
    defaultMessage: 'Cancel',
  },
});

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateVariant,
  Spinner,
  Title,
} from '@patternfly/react-core';

const LoadingStep = ({ onClose, customText, cancelTitle, description }) => (
  <Bullseye>
    <EmptyState
      titleText={
        <Title headingLevel="h2" size="xl" className="pf-v6-u-mt-xl">
          {customText}
        </Title>
      }
      icon={Spinner}
      variant={EmptyStateVariant.full}
      className="pf-v6-u-mt-4xl"
    >
      {description && <EmptyStateBody className="src-c-wizard--step-text">{description}</EmptyStateBody>}
      {onClose && (
        <EmptyStateActions className="pf-v6-u-mt-xl">
          <Button variant="link" onClick={onClose}>
            {cancelTitle}
          </Button>
        </EmptyStateActions>
      )}
    </EmptyState>
  </Bullseye>
);

LoadingStep.propTypes = {
  onClose: PropTypes.func,
  customText: PropTypes.node,
  cancelTitle: PropTypes.node,
  description: PropTypes.node,
};

LoadingStep.defaultProps = {
  customText: <FormattedMessage {...messages.wizardLoadingtext} />,
  cancelTitle: <FormattedMessage {...messages.wizardCanceltext} />,
};

export default LoadingStep;
