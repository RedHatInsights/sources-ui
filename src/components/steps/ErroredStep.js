import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';

import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

const ErroredStep = ({ onClose, returnButtonTitle, message, title, customText, primaryAction, secondaryActions, Component }) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.full} className="pf-u-mt-4xl">
      <EmptyStateIcon icon={ExclamationCircleIcon} color="var(--pf-global--danger-color--100)" className="pf-u-mb-0" />
      <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
        {title}
      </Title>
      <EmptyStateBody className="src-c-wizard--step-text">{message || customText}</EmptyStateBody>
      <Component variant="primary" onClick={primaryAction || onClose}>
        {returnButtonTitle}
      </Component>
      {secondaryActions && <EmptyStateSecondaryActions className="pf-u-mt-sm">{secondaryActions}</EmptyStateSecondaryActions>}
    </EmptyState>
  </Bullseye>
);

ErroredStep.propTypes = {
  onClose: PropTypes.func.isRequired,
  returnButtonTitle: PropTypes.node,
  message: PropTypes.node,
  title: PropTypes.node,
  customText: PropTypes.node,
  primaryAction: PropTypes.func,
  secondaryActions: PropTypes.node,
  Component: PropTypes.elementType,
};

ErroredStep.defaultProps = {
  title: <FormattedMessage id="wizard.unsuccConfiguration" defaultMessage="Something went wrong" />,
  // eslint-disable-next-line max-len
  customText: (
    <FormattedMessage
      id="wizard.errorText"
      defaultMessage="There was a problem while trying to add your source. Please try again. If the error persists, open a support case."
    />
  ),
  Component: Button,
};

export default ErroredStep;
