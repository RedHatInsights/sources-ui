import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Spinner,
  Title,
} from '@patternfly/react-core';

const LoadingStep = ({ onClose, customText, cancelTitle, description }) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.full} className="pf-u-mt-4xl">
      <EmptyStateIcon icon={Spinner} className="pf-u-mb-0" />
      <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
        {customText}
      </Title>
      {description && <EmptyStateBody className="src-c-wizard--step-text">{description}</EmptyStateBody>}
      {onClose && (
        <EmptyStateActions className="pf-u-mt-xl">
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
  customText: <FormattedMessage id="wizard.loadingText" defaultMessage="Loading, please wait." />,
  cancelTitle: <FormattedMessage id="wizard.cancelText" defaultMessage="Cancel" />,
};

export default LoadingStep;
