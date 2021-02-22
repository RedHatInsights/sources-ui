import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { Button } from '@patternfly/react-core/dist/esm/components/Button/Button';
import { EmptyState, EmptyStateVariant } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyState';
import { EmptyStateIcon } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyStateIcon';
import { EmptyStateBody } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyStateBody';
import { EmptyStateSecondaryActions } from '@patternfly/react-core/dist/esm/components/EmptyState/EmptyStateSecondaryActions';
import { Bullseye } from '@patternfly/react-core/dist/esm/layouts/Bullseye/Bullseye';
import { Title } from '@patternfly/react-core/dist/esm/components/Title/Title';

import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';

const TimeoutStep = ({ onClose, returnButtonTitle, title, secondaryActions }) => {
  const intl = useIntl();

  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full} className="pf-u-mt-4xl">
        <EmptyStateIcon icon={WrenchIcon} color="var(--pf-global--Color--200)" className="pf-u-mb-0" />
        <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
          {title}
        </Title>
        <EmptyStateBody>
          {intl.formatMessage(
            {
              id: 'wizard.uncompleteConfigurationDescription',
              defaultMessage:
                'We are still working to confirm credentials and app settings.{newLine}To track progress, check the Status column in the Sources table.',
            },
            { newLine: <br key="br" /> }
          )}
        </EmptyStateBody>
        <Button variant="primary" onClick={onClose} className="pf-u-mt-xl">
          {returnButtonTitle}
        </Button>
        {secondaryActions && <EmptyStateSecondaryActions>{secondaryActions}</EmptyStateSecondaryActions>}
      </EmptyState>
    </Bullseye>
  );
};

TimeoutStep.propTypes = {
  onClose: PropTypes.func.isRequired,
  returnButtonTitle: PropTypes.node.isRequired,
  title: PropTypes.node,
  secondaryActions: PropTypes.node,
};

TimeoutStep.defaultProps = {
  title: <FormattedMessage id="wizard.uncompleteConfigurationTitle" defaultMessage="Configuration in progress" />,
};

export default TimeoutStep;
