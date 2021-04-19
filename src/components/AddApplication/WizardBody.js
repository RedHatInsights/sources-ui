import React from 'react';
import { PropTypes } from 'prop-types';
import { Wizard } from '@patternfly/react-core';

const WizardBodyAttach = ({ step, goToSources, title, description }) => (
  <Wizard
    isOpen={true}
    onClose={goToSources}
    title={title}
    description={description}
    steps={[
      {
        name: 'Finish',
        component: step,
        isFinishedStep: true,
      },
    ]}
  />
);

WizardBodyAttach.propTypes = {
  step: PropTypes.node.isRequired,
  goToSources: PropTypes.func.isRequired,
  title: PropTypes.string,
  description: PropTypes.string,
};

export default WizardBodyAttach;
