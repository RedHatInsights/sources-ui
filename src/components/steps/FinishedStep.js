import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { ClipboardCopy } from '@patternfly/react-core';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Form,
  FormGroup,
  Title,
} from '@patternfly/react-core';

import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import computeSourcesUrl from '../../utilities/computeSourcesUrl';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const FinishedStep = ({
  onClose,
  successfulMessage,
  hideSourcesButton,
  returnButtonTitle,
  title,
  linkText,
  secondaryActions,
  uuid,
}) => {
  const { isBeta } = useChrome();
  return (
    <Bullseye>
      <EmptyState variant={EmptyStateVariant.full} className="pf-u-mt-4xl">
        <EmptyStateIcon icon={CheckCircleIcon} color="var(--pf-global--success-color--100)" className="pf-u-mb-0" />
        <Title headingLevel="h2" size="xl" className="pf-u-mt-xl">
          {title}
        </Title>
        <EmptyStateBody className="src-c-wizard--step-text">{successfulMessage}</EmptyStateBody>
        {uuid && (
          <Form className="src-c-uuid">
            <FormGroup label={<FormattedMessage id="wizard.sourcesUid" defaultMessage="Source UUID" />} fieldId="source-uuid">
              <ClipboardCopy id="source-uuid" isReadOnly hoverTip="Source UUID" clickTip="Copied" className="pf-u-mt-md">
                {uuid}
              </ClipboardCopy>
            </FormGroup>
          </Form>
        )}
        <Button variant="primary" onClick={onClose} className="pf-u-mt-xl">
          {returnButtonTitle}
        </Button>
        {!hideSourcesButton && (
          <EmptyStateActions>
            <Button variant="link" component="a" target="_blank" rel="noopener noreferrer" href={computeSourcesUrl(isBeta())}>
              {linkText}
            </Button>
          </EmptyStateActions>
        )}
        {secondaryActions && <EmptyStateActions>{secondaryActions}</EmptyStateActions>}
      </EmptyState>
    </Bullseye>
  );
};

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
