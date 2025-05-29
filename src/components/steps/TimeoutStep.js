import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import { ClipboardCopy } from '@patternfly/react-core';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateVariant,
  Title,
} from '@patternfly/react-core';

import WrenchIcon from '@patternfly/react-icons/dist/esm/icons/wrench-icon';

const TimeoutStep = ({ onClose, returnButtonTitle, title, secondaryActions, uuid }) => {
  const intl = useIntl();

  return (
    <Bullseye>
      <EmptyState
        titleText={
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mt-xl">
            {title}
          </Title>
        }
        icon={WrenchIcon}
        variant={EmptyStateVariant.full}
        className="pf-v6-u-mt-4xl"
      >
        <EmptyStateBody>
          {intl.formatMessage(
            {
              id: 'wizard.uncompleteConfigurationDescription',
              defaultMessage:
                'We are still working to confirm credentials and app settings.{newLine}To track progress, check the Status column in the Integrations table.',
            },
            { newLine: <br key="br" /> },
          )}
          {uuid ?? (
            <ClipboardCopy isReadOnly hoverTip="Source UUID" clickTip="Copied" className="pf-v6-u-mt-md">
              {uuid}
            </ClipboardCopy>
          )}
        </EmptyStateBody>
        <Button variant="primary" onClick={onClose} className="pf-v6-u-mt-xl">
          {returnButtonTitle}
        </Button>
        {secondaryActions && <EmptyStateActions>{secondaryActions}</EmptyStateActions>}
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
