import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { Button, Icon, Modal, ModalBody, ModalFooter, ModalHeader, Title } from '@patternfly/react-core';

import { ExclamationTriangleIcon } from '@patternfly/react-icons';

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
      title={title}
      aria-label={intl.formatMessage({ id: 'wizard.closeAriaLabel', defaultMessage: 'Close add integration wizard' })}
      isOpen
      onClose={onStay}
    >
      <ModalHeader>
        <Title headingLevel="h1" size="2xl">
          <Icon size="sm" status="warning">
            <ExclamationTriangleIcon className="src-c-warning-icon" aria-label="Exclamation icon" />
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
  title: <FormattedMessage id="wizard.closeTitle" defaultMessage="Cancel creating the integration?" />,
  exitTitle: <FormattedMessage id="wizard.exitText" defaultMessage="Cancel" />,
  stayTitle: <FormattedMessage id="wizard.stayText" defaultMessage="Stay" />,
  description: <FormattedMessage id="wizard.closeWarning" defaultMessage="All inputs will be discarded." />,
};

export default CloseModal;
