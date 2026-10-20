import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages } from 'react-intl';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';

import ExclamationCircleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-circle-icon';

const messages = defineMessages({
  wizardUnsuccconfiguration: {
    id: 'wizard.unsuccConfiguration',
    defaultMessage: 'Something went wrong',
  },
  wizardErrortext: {
    id: 'wizard.errorText',
    defaultMessage:
      'There was a problem while trying to add your source. Please try again. If the error persists, open a support case.',
  },
});

const ErroredStep = ({ onClose, returnButtonTitle, message, title, customText, primaryAction, secondaryActions, Component }) => (
  <Bullseye>
    <EmptyState
      titleText={
        <Title headingLevel="h2" size="xl" className="pf-v6-u-mt-xl">
          {title}
        </Title>
      }
      icon={ExclamationCircleIcon}
      variant={EmptyStateVariant.full}
      className="pf-v6-u-mt-4xl"
    >
      <EmptyStateBody className="src-c-wizard--step-text">{message || customText}</EmptyStateBody>
      <Component variant="primary" onClick={primaryAction || onClose}>
        {returnButtonTitle}
      </Component>
      {secondaryActions && <EmptyStateActions className="pf-v6-u-mt-sm">{secondaryActions}</EmptyStateActions>}
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
  title: <FormattedMessage {...messages.wizardUnsuccconfiguration} />,
  // eslint-disable-next-line max-len
  customText: <FormattedMessage {...messages.wizardErrortext} />,
  Component: Button,
};

export default ErroredStep;
