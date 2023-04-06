import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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

import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import computeSourcesUrl from '../../utilities/computeSourcesUrl';

const FinishedStep = ({
  onClose,
  successfulMessage,
  hideSourcesButton,
  returnButtonTitle,
  title,
  linkText,
  secondaryActions,
  uuid,
}) => (
  <Bullseye>
    <EmptyState variant={EmptyStateVariant.full} className="pf-u-mt-4xl">
      <EmptyStateIcon icon={CheckCircleIcon} color="var(--pf-global--success-color--100)" className="pf-u-mb-0" />
      <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
        {title}
      </Title>
      {uuid ?? (
        <ClipboardCopy isReadOnly hoverTip="Source UUID" clickTip="Copied" className="pf-u-mt-md">
          {uuid}
        </ClipboardCopy>
      )}
      <EmptyStateBody className="src-c-wizard--step-text">{successfulMessage}</EmptyStateBody>
      <Button variant="primary" onClick={onClose} className="pf-u-mt-xl">
        {returnButtonTitle}
      </Button>
      {!hideSourcesButton && (
        <EmptyStateSecondaryActions>
          <Button variant="link" component="a" target="_blank" rel="noopener noreferrer" href={computeSourcesUrl()}>
            {linkText}
          </Button>
        </EmptyStateSecondaryActions>
      )}
      {secondaryActions && <EmptyStateSecondaryActions>{secondaryActions}</EmptyStateSecondaryActions>}
    </EmptyState>
  </Bullseye>
);

FinishedStep.propTypes = {
  onClose: PropTypes.func.isRequired,
  successfulMessage: PropTypes.node.isRequired,
  hideSourcesButton: PropTypes.bool,
  returnButtonTitle: PropTypes.node.isRequired,
  title: PropTypes.node,
  linkText: PropTypes.node,
  secondaryActions: PropTypes.node,
  uuid: PropTypes.string,
};

FinishedStep.defaultProps = {
  title: <FormattedMessage id="wizard.succConfiguration" defaultMessage="Configuration successful" />,
  linkText: <FormattedMessage id="wizard.toSources" defaultMessage="Take me to sources" />,
};

export default FinishedStep;
