import React from 'react';
import { defineMessages, useIntl } from 'react-intl';
import { PropTypes } from 'prop-types';
import { Modal, ModalBody, Wizard, WizardHeader, WizardStep } from '@patternfly/react-core';

const messages = defineMessages({
  finish: {
    id: 'wizard.finish',
    defaultMessage: 'Finish',
  },
});

const WizardBodyAttach = ({ step, goToSources, title, description }) => {
  const intl = useIntl();
  return (
    <Modal isOpen onClose={goToSources} onEscapePress={goToSources}>
      <ModalBody>
        <Wizard onClose={goToSources} header={<WizardHeader title={title} description={description} />}>
          <WizardStep
            id="finish"
            name={intl.formatMessage(messages.finish)}
            footer={{ nextButtonText: intl.formatMessage(messages.finish), onNext: goToSources }}
          >
            {step}
          </WizardStep>
        </Wizard>
      </ModalBody>
    </Modal>
  );
};

WizardBodyAttach.propTypes = {
  step: PropTypes.node.isRequired,
  goToSources: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default WizardBodyAttach;
