import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Title } from '@patternfly/react-core';

import { ExclamationTriangleIcon } from '@patternfly/react-icons';

const messages = defineMessages({
  exclamationIconAria: {
    id: 'closeModal.exclamationIconAria',
    defaultMessage: 'Exclamation icon',
  },

  wizardClosearialabel: {
    id: 'wizard.closeAriaLabel',
    defaultMessage: 'Close add integration wizard',
  },
  wizardClosetitle: {
    id: 'wizard.closeTitle',
    defaultMessage: 'Cancel creating the integration?',
  },
  wizardExittext: {
    id: 'wizard.exitText',
    defaultMessage: 'Cancel',
  },
  wizardStaytext: {
    id: 'wizard.stayText',
    defaultMessage: 'Stay',
  },
  wizardClosewarning: {
    id: 'wizard.closeWarning',
    defaultMessage: 'All inputs will be discarded.',
  },
});

const CloseModal = ({ onExit, onStay, title, exitTitle, stayTitle, description }) => {
  const intl = useIntl();

  const isMounted = useRef(false);

  return (
    <Modal
      onEscapePress={(e) => {
        isMounted.current ? onStay(e) : undefined;
        isMounted.current = true;
      }}
      className="sources"
      variant="small"
      aria-label={intl.formatMessage(messages.wizardClosearialabel)}
      isOpen
      onClose={onStay}
    >
      <ModalHeader>
        <Title headingLevel="h1" size="2xl">
          <Icon size="xl" status="warning">
            <ExclamationTriangleIcon
              className="src-c-warning-icon"
              aria-label={intl.formatMessage(messages.exclamationIconAria)}
            />
          </Icon>
          {title}
        </Title>
      </ModalHeader>
      <ModalBody>{description}</ModalBody>
      <ModalFooter>
        <Button key="confirm" variant="primary" id="on-exit-button" onClick={onExit}>
          {exitTitle}
        </Button>
        <Button key="cancel" variant="link" id="on-stay-button" onClick={onStay}>
          {stayTitle}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

CloseModal.propTypes = {
  onExit: PropTypes.func.isRequired,
  onStay: PropTypes.func.isRequired,
  title: PropTypes.node,
  exitTitle: PropTypes.node,
  stayTitle: PropTypes.node,
  description: PropTypes.node,
};

CloseModal.defaultProps = {
  title: <FormattedMessage {...messages.wizardClosetitle} />,
  exitTitle: <FormattedMessage {...messages.wizardExittext} />,
  stayTitle: <FormattedMessage {...messages.wizardStaytext} />,
  description: <FormattedMessage {...messages.wizardClosewarning} />,
};

export default CloseModal;
