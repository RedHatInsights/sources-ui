import React from 'react';
import { PropTypes } from 'prop-types';
import { useIntl } from 'react-intl';
import { Wizard } from '@patternfly/react-core/dist/js/components/Wizard/Wizard';

const WizardBodyAttach = ({ step, goToSources, name }) => {
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
                    defaultMessage: 'Add or remove applications from {name}.'
                }, { name })
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
    goToSources: PropTypes.func.isRequired,
    name: PropTypes.string
};

export default WizardBodyAttach;
