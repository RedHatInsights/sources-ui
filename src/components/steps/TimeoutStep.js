import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { ClipboardCopy } from '@patternfly/react-core';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateSecondaryActions,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';

import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';

const TimeoutStep = ({ onClose, returnButtonTitle, title, secondaryActions, uuid }) => {
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
          <ClipboardCopy isReadOnly hoverTip="Source UUID" clickTip="Copied" className="pf-u-mt-xl">
            {uuid}
          </ClipboardCopy>
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
  uuid: PropTypes.string,
};

TimeoutStep.defaultProps = {
  title: <FormattedMessage id="wizard.uncompleteConfigurationTitle" defaultMessage="Configuration in progress" />,
};

export default TimeoutStep;
