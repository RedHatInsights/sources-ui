import React from 'react';
import { PropTypes } from 'prop-types';
import { Modal, ModalBody, Wizard, WizardHeader, WizardStep } from '@patternfly/react-core';

const WizardBodyAttach = ({ step, goToSources, title, description }) => (
  <Modal isOpen onClose={goToSources} onEscapePress={goToSources}>
    <ModalBody>
      <Wizard onClose={goToSources} header={<WizardHeader title={title} description={description} />}>
        <WizardStep id="finish" name="Finish" footer={{ nextButtonText: 'Finish', onNext: goToSources }}>
          {step}
        </WizardStep>
      </Wizard>
    </ModalBody>
  </Modal>
);

WizardBodyAttach.propTypes = {
  step: PropTypes.node.isRequired,
  goToSources: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default WizardBodyAttach;
