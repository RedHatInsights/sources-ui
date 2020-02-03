import React from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Wizard } from '@patternfly/react-core';

const WizardBodyAttach = ({ step, goToSources }) => {
    const intl = useIntl();

    return (
        <Wizard
            isOpen={ true }
            onClose={goToSources}
            title={intl.formatMessage({
                id: 'sources.manageApps',
                defaultMessage: 'Manage applications'
            })}
            description={
                intl.formatMessage({
                    id: 'sources.addAppDescription',
                    defaultMessage: 'You are managing applications of this source.'
                })
            }
            steps={ [{
                name: 'Finish',
                component: step,
                isFinishedStep: true
            }] }
        />
    );
};

WizardBodyAttach.propTypes = {
    step: PropTypes.node.isRequired,
    goToSources: PropTypes.func.isRequired
};

export default WizardBodyAttach;
