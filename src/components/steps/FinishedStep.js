import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, defineMessages, useIntl } from 'react-intl';
import { ClipboardCopy } from '@patternfly/react-core';

import {
  Bullseye,
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateVariant,
  Form,
  FormGroup,
  Title,
} from '@patternfly/react-core';

import CheckCircleIcon from '@patternfly/react-icons/dist/esm/icons/check-circle-icon';
import computeSourcesUrl from '../../utilities/computeSourcesUrl';
import useChrome from '@redhat-cloud-services/frontend-components/useChrome';

const messages = defineMessages({
  sourceUuid: {
    id: 'finishedStep.sourceUuid',
    defaultMessage: 'Source UUID',
  },
  copied: {
    id: 'finishedStep.copied',
    defaultMessage: 'Copied',
  },

  wizardSourcesuid: {
    id: 'wizard.sourcesUid',
    defaultMessage: 'Source UUID',
  },
  wizardSuccconfiguration: {
    id: 'wizard.succConfiguration',
    defaultMessage: 'Configuration successful',
  },
  wizardTosources: {
    id: 'wizard.toSources',
    defaultMessage: 'Take me to sources',
  },
});

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
  const intl = useIntl();
  const { isBeta } = useChrome();
  return (
    <Bullseye>
      <EmptyState
        titleText={
          <Title headingLevel="h2" size="xl" className="pf-v6-u-mt-xl">
            {title}
          </Title>
        }
        icon={CheckCircleIcon}
        variant={EmptyStateVariant.full}
        className="pf-v6-u-mt-4xl"
      >
        <EmptyStateBody className="src-c-wizard--step-text">{successfulMessage}</EmptyStateBody>
        {uuid && (
          <Form className="src-c-uuid">
            <FormGroup label={<FormattedMessage {...messages.wizardSourcesuid} />} fieldId="source-uuid">
              <ClipboardCopy
                id="source-uuid"
                isReadOnly
                hoverTip={intl.formatMessage(messages.sourceUuid)}
                clickTip={intl.formatMessage(messages.copied)}
                className="pf-v6-u-mt-md"
              >
                {uuid}
              </ClipboardCopy>
            </FormGroup>
          </Form>
        )}
        <Button variant="primary" onClick={onClose} className="pf-v6-u-mt-xl">
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
  title: <FormattedMessage {...messages.wizardSuccconfiguration} />,
  linkText: <FormattedMessage {...messages.wizardTosources} />,
};

export default FinishedStep;
