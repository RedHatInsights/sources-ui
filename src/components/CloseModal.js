import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useIntl, FormattedMessage } from 'react-intl';

import { Button, Modal, Title } from '@patternfly/react-core';

import ExclamationTriangleIcon from '@patternfly/react-icons/dist/esm/icons/exclamation-triangle-icon';

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
      aria-label={intl.formatMessage({ id: 'wizard.closeAriaLabel', defaultMessage: 'Close add source wizard' })}
      header={
        <Title headingLevel="h1" size="2xl">
          <ExclamationTriangleIcon size="sm" className="ins-c-source__warning-icon" />
          {title}
        </Title>
      }
      isOpen
      onClose={onStay}
      actions={[
        <Button key="confirm" variant="primary" id="on-exit-button" onClick={onExit}>
          {exitTitle}
        </Button>,
        <Button key="cancel" variant="link" id="on-stay-button" onClick={onStay}>
          {stayTitle}
        </Button>,
      ]}
    >
      {description}
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
  title: <FormattedMessage id="wizard.closeTitle" defaultMessage="Exit source creation?" />,
  exitTitle: <FormattedMessage id="wizard.exitText" defaultMessage="Exit" />,
  stayTitle: <FormattedMessage id="wizard.stayText" defaultMessage="Stay" />,
  description: <FormattedMessage id="wizard.closeWarning" defaultMessage="All inputs will be discarded." />,
};

export default CloseModal;
